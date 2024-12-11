import { createClient } from "next-sanity";

const client = createClient({
  projectId: 'o951bctg', // Replace with your Sanity project ID
  dataset: 'production',
  apiVersion: '2024-02-11',
  useCdn: true,
});

export default client;