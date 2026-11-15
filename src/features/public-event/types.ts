export enum EventStatus {
  UPCOMING = "upcoming",
  ONGOING = "ongoing",
  FINISHED = "finished",
}

export interface Event {
  id: string,
  title: string,
  description: string,
  date: string,
  loction: string,
  available_quota: number,
  max_quota: number,
  status: EventStatus
}