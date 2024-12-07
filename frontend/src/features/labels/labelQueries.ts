import { gql } from '@apollo/client';

export const GET_LABELS = gql`
  query GetLabels {
    labels {
      nodes {
        id
        name
        description
        color
      }
    }
  }
`;

export const ADD_LABEL = gql`
  mutation AddLabel($name: String!, $description: String, $color: String!) {
    addLabel(name: $name, description: $description, color: $color) {
      id
      name
      description
      color
    }
  }
`; 