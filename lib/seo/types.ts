export type MetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: readonly string[];
  article?: {
    publishedTime?: string | null;
    modifiedTime?: string | null;
    tags?: readonly string[];
  };
};

export type Crumb = {
  name: string;
  path: string;
};

export type JsonLdNode = Record<string, unknown>;
