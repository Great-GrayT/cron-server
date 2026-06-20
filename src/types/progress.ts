export interface ProgressUpdate {
  type: 'progress' | 'complete' | 'error';
  stage: string;
  message: string;
  current?: number;
  total?: number;
  percentage?: number;
  data?: any;
}

export interface ScraperProgress extends ProgressUpdate {
  keyword?: string;
  country?: string;
  pageNumber?: number;
  jobsFound?: number;
}

export interface RSSProgress extends ProgressUpdate {
  feedIndex?: number;
  totalFeeds?: number;
  jobsFound?: number;
  recentJobs?: number;
}
