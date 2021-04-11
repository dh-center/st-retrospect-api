import { Client, ClientOptions } from '@elastic/elasticsearch';

/**
 * Creates configured ElasticSearch client
 */
export default function getElasticClient(): Client {
  const esEndpoint = process.env.ELASTICSEARCH_ENDPOINT;

  if (!esEndpoint) {
    throw new Error('No elastic search endpoint configured. Please check environment variables');
  }

  const options: ClientOptions = {
    node: process.env.ELASTICSEARCH_ENDPOINT,
  };

  const apiKey = process.env.ELASTICSEARCH_API_KEY;

  if (apiKey) {
    options.auth = {
      apiKey,
    };
  }

  return new Client(options);
}
