interface YoutubeItem {
  kind: string;
  etag: string;
  id: {
    kind: string;
    /* The important ID */
    videoId: string;
  };
}

export interface YoutubeApiResponse {
  kind: string;
  etag: string;
  nextPageToken: string;
  regionCode: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YoutubeItem[];
}

export interface YoutubeApiResponse {
  kind: string;
  etag: string;
  nextPageToken: string;
  regionCode: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YoutubeItem[];
}
export interface YoutubeTrackApiResponse {
  kind: string;
  etag: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YoutubeTrack[];
}

export interface YoutubeTrack extends Omit<YoutubeItem, "id"> {
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    /* example title "Asaf Avidan \"Reckoning Song\" (acoustic Version - Live TV Taratata 2013)" */
    title: string;
    description: string;
    thumbnails: {
      default: {
        url: string;
        width: number;
        height: number;
      };
      medium: {
        url: string;
        width: number;
        height: number;
      };
      hight: {
        url: string;
        width: number;
        height: number;
      };
      standard: {
        url: string;
        width: number;
        height: number;
      };
      maxres: {
        url: string;
        width: number;
        height: number;
      };
    };
    channelTitle: string;
    tags: string[];
    categoryId: string;
    liveBroadcastContent: string;
    localized: {
      title: string;
      description: string;
    };
  };
}
