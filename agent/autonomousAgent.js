const { Agent, Task, Crew } = require('crewai');
const { OpenAI } = require('langchain/llms/openai');
const { PromptTemplate } = require('langchain/prompts');
const { LLMChain } = require('langchain/chains');
const MemorySystem = require('../integrations/memory');
const SystemControl = require('../integrations/systemControl');

class AutonomousAgent {
    constructor(config) {
        this.memory = new MemorySystem();
        this.systemControl = new SystemControl();
        this.llm = new OpenAI({
            openAIApiKey: config.openai.apiKey,
            temperature: 0.7,
            modelName: 'gpt-4'
        });

        // Define specialized agents
        this.agents = {
            planner: new Agent({
                role: 'Task Planner',
                goal: 'Break down complex tasks into executable steps',
                backstory: 'Expert at analyzing tasks and creating detailed execution plans',
                tools: [this.planningTool.bind(this)]
            }),
            executor: new Agent({
                role: 'Task Executor',
                goal: 'Execute tasks efficiently and handle errors',
                backstory: 'Skilled at executing complex tasks and recovering from failures',
                tools: [
                    this.executionTool.bind(this),
                    this.errorRecoveryTool.bind(this)
                ]
            }),
            validator: new Agent({
                role: 'Result Validator',
                goal: 'Verify task results and ensure quality',
                backstory: 'Expert at validating results and ensuring task completion',
                tools: [this.validationTool.bind(this)]
            })
        };
    }

    async planningTool(task) {
        const prompt = new PromptTemplate({
            template: `Analyze the following task and break it down into clear, executable steps:
            Task: {task}
            
            Consider:
            1. Required resources and dependencies
            2. Potential challenges and risks
            3. Success criteria for each step
            
            Provide a detailed plan with:
            - Step-by-step breakdown
            - Required tools/resources
            - Success criteria
            - Fallback options`,
            inputVariables: ['task']
        });

        const chain = new LLMChain({ llm: this.llm, prompt });
        const plan = await chain.call({ task });
        
        // Store the plan in memory for future reference
        await this.memory.recordPattern('task_plan', {
            task,
            plan: plan.text,
            timestamp: new Date()
        });

        return JSON.parse(plan.text);
    }

    async executionTool(step, context) {
        try {
            // Check if we have a similar successful execution in memory
            const patterns = await this.memory.getCommonPatterns('successful_execution');
            const relevantPattern = patterns.find(p => 
                p.pattern_data.step_type === step.type
            );

            if (relevantPattern) {
                // Use the successful pattern as a guide
                return await this.executeWithPattern(step, relevantPattern.pattern_data);
            }

            // Execute the step based on its type
            switch (step.type) {
                case 'system_command':
                    return await this.systemControl.executeCommand(step.command);
                case 'file_operation':
                    return await this.systemControl.manageFile(
                        step.action,
                        step.source,
                        step.destination
                    );
                case 'app_launch':
                    return await this.systemControl.launchApp(step.appName);
                default:
                    throw new Error(`Unknown step type: ${step.type}`);
            }
        } catch (error) {
            // Log the error and attempt recovery
            await this.errorRecoveryTool(error, step, context);
            throw error;
        }
    }

    async errorRecoveryTool(error, step, context) {
        const prompt = new PromptTemplate({
            template: `Analyze the following error and suggest recovery steps:
            Error: {error}
            Step: {step}
            Context: {context}
            
            Provide:
            1. Error analysis
            2. Recovery steps
            3. Prevention measures`,
            inputVariables: ['error', 'step', 'context']
        });

        const chain = new LLMChain({ llm: this.llm, prompt });
        const recovery = await chain.call({
            error: error.message,
            step: JSON.stringify(step),
            context: JSON.stringify(context)
        });

        // Store the error and recovery for future reference
        await this.memory.recordPattern('error_recovery', {
            error: error.message,
            step,
            recovery: recovery.text,
            timestamp: new Date()
        });

        return JSON.parse(recovery.text);
    }

    async validationTool(result, criteria) {
        const prompt = new PromptTemplate({
            template: `Validate the following result against the success criteria:
            Result: {result}
            Criteria: {criteria}
            
            Provide:
            1. Validation status
            2. Issues found (if any)
            3. Suggestions for improvement`,
            inputVariables: ['result', 'criteria']
        });

        const chain = new LLMChain({ llm: this.llm, prompt });
        const validation = await chain.call({
            result: JSON.stringify(result),
            criteria: JSON.stringify(criteria)
        });

        return JSON.parse(validation.text);
    }

    async executeWithPattern(step, pattern) {
        // Use the successful pattern as a guide while adapting to current context
        const prompt = new PromptTemplate({
            template: `Adapt the following successful pattern to the current step:
            Pattern: {pattern}
            Current Step: {step}
            
            Provide:
            1. Adapted execution plan
            2. Required modifications
            3. Risk assessment`,
            inputVariables: ['pattern', 'step']
        });

        const chain = new LLMChain({ llm: this.llm, prompt });
        const adaptation = await chain.call({
            pattern: JSON.stringify(pattern),
            step: JSON.stringify(step)
        });

        return JSON.parse(adaptation.text);
    }

    async executeTask(userInput) {
        try {
            // Create the main task
            const task = new Task({
                description: userInput,
                agent: this.agents.planner
            });

            // Create a crew with our specialized agents
            const crew = new Crew({
                agents: Object.values(this.agents),
                tasks: [task],
                verbose: true
            });

            // Execute the task
            const result = await crew.kickoff();

            // Log the successful execution
            await this.memory.logSessionAction(
                Date.now().toString(),
                'task_execution',
                {
                    input: userInput,
                    result,
                    timestamp: new Date()
                }
            );

            return result;
        } catch (error) {
            // Log the error and attempt recovery
            const recovery = await this.errorRecoveryTool(error, {
                type: 'task_execution',
                input: userInput
            }, {});

            // Log the error and recovery attempt
            await this.memory.logSessionAction(
                Date.now().toString(),
                'error_recovery',
                {
                    error: error.message,
                    recovery,
                    timestamp: new Date()
                }
            );

            throw error;
        }
    }

    async close() {
        await this.memory.close();
    }
}

module.exports = AutonomousAgent; 