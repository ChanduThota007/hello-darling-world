const { google } = require('googleapis');
const config = require('./config');

class CalendarIntegration {
    constructor() {
        this.auth = new google.auth.OAuth2(
            config.google.clientId,
            config.google.clientSecret,
            config.google.redirectUri
        );
        this.calendar = google.calendar({ version: 'v3', auth: this.auth });
    }

    async setCredentials(tokens) {
        this.auth.setCredentials(tokens);
    }

    async listEvents(timeMin, timeMax, maxResults = 10) {
        try {
            const response = await this.calendar.events.list({
                calendarId: 'primary',
                timeMin: timeMin.toISOString(),
                timeMax: timeMax.toISOString(),
                maxResults: maxResults,
                singleEvents: true,
                orderBy: 'startTime'
            });

            return response.data.items;
        } catch (error) {
            console.error('Error listing calendar events:', error);
            throw error;
        }
    }

    async createEvent(eventDetails) {
        try {
            const event = {
                summary: eventDetails.summary,
                description: eventDetails.description,
                start: {
                    dateTime: eventDetails.startTime,
                    timeZone: eventDetails.timeZone || 'UTC'
                },
                end: {
                    dateTime: eventDetails.endTime,
                    timeZone: eventDetails.timeZone || 'UTC'
                },
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'email', minutes: 24 * 60 },
                        { method: 'popup', minutes: 30 }
                    ]
                }
            };

            const response = await this.calendar.events.insert({
                calendarId: 'primary',
                requestBody: event
            });

            return response.data;
        } catch (error) {
            console.error('Error creating calendar event:', error);
            throw error;
        }
    }

    async updateEvent(eventId, eventDetails) {
        try {
            const event = await this.calendar.events.get({
                calendarId: 'primary',
                eventId: eventId
            });

            const updatedEvent = {
                ...event.data,
                summary: eventDetails.summary || event.data.summary,
                description: eventDetails.description || event.data.description,
                start: {
                    dateTime: eventDetails.startTime || event.data.start.dateTime,
                    timeZone: eventDetails.timeZone || event.data.start.timeZone
                },
                end: {
                    dateTime: eventDetails.endTime || event.data.end.dateTime,
                    timeZone: eventDetails.timeZone || event.data.end.timeZone
                }
            };

            const response = await this.calendar.events.update({
                calendarId: 'primary',
                eventId: eventId,
                requestBody: updatedEvent
            });

            return response.data;
        } catch (error) {
            console.error('Error updating calendar event:', error);
            throw error;
        }
    }

    async deleteEvent(eventId) {
        try {
            await this.calendar.events.delete({
                calendarId: 'primary',
                eventId: eventId
            });
            return `Event ${eventId} deleted successfully`;
        } catch (error) {
            console.error('Error deleting calendar event:', error);
            throw error;
        }
    }

    async getUpcomingReminders(hours = 24) {
        try {
            const now = new Date();
            const endTime = new Date(now.getTime() + (hours * 60 * 60 * 1000));

            const events = await this.listEvents(now, endTime);
            
            // Filter events with reminders
            const reminders = events.filter(event => {
                if (!event.reminders || !event.reminders.overrides) return false;
                
                const eventStart = new Date(event.start.dateTime);
                const timeUntilEvent = eventStart.getTime() - now.getTime();
                
                // Check if any reminder is due within the next hour
                return event.reminders.overrides.some(reminder => {
                    const reminderTime = timeUntilEvent - (reminder.minutes * 60 * 1000);
                    return reminderTime > 0 && reminderTime <= (60 * 60 * 1000);
                });
            });

            return reminders;
        } catch (error) {
            console.error('Error getting upcoming reminders:', error);
            throw error;
        }
    }

    async syncWithLocalReminders(localReminders) {
        try {
            const syncedEvents = [];
            
            for (const reminder of localReminders) {
                const eventDetails = {
                    summary: reminder.title,
                    description: reminder.description || '',
                    startTime: reminder.dueTime.toISOString(),
                    endTime: new Date(reminder.dueTime.getTime() + (30 * 60 * 1000)).toISOString(), // 30 min duration
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                };

                const event = await this.createEvent(eventDetails);
                syncedEvents.push(event);
            }

            return syncedEvents;
        } catch (error) {
            console.error('Error syncing with local reminders:', error);
            throw error;
        }
    }
}

module.exports = CalendarIntegration; 