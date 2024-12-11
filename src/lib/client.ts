import { createClient } from "next-sanity";

const client = createClient({
  projectId: 'o951bctg', // Replace with your Sanity project ID
  dataset: 'production',
  apiVersion: '2024-02-11',
  useCdn: true,
  token: 'skRCrlKWRMCnMmaDqHqJBSBSjw3fbu2WmPzGgKf9wf0RNTpTnEworvemh7G4LoGVTOeQJk6sOkSPozvE8w2ZidyAWTzWUmWQd4zXPehDx8RMXRv7VNjd6CMp7PcEx1rhF6zXf5QDM5Dcp1OnMWUTosORTQdrZYXWhoU7mbiuhXZscM5ANzJB'
});

export default client;