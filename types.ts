
export interface ProposalData {
  message: string;
  sender: string;
}

export enum AppState {
  CREATOR = 'CREATOR',
  VIEWER = 'VIEWER',
  SUCCESS = 'SUCCESS'
}
