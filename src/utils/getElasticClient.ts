import { Client } from '@elastic/elasticsearch';

/**
 * Creates configured ElasticSearch client
 */
export default function getElasticClient(): Client {
  const esEndpoint = process.env.ELASTICSEARCH_ENDPOINT;

  if (!esEndpoint) {
    throw new Error('No elastic search endpoint configured. Please check environment variables');
  }

  return new Client({ node: process.env.ELASTICSEARCH_ENDPOINT });
}
