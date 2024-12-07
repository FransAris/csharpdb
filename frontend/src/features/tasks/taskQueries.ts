import { gql } from '@apollo/client';

export const GET_TASKS = gql`
  query GetTasks {
    tasks {
      nodes {
        id
        title
        description
        status
        isCompleted
        lastModified
        labelId
        label {
          id
          name
          color
        }
      }
    }
  }
`;

export const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($id: Int!, $status: String!) {
    updateTaskStatus(id: $id, status: $status) {
      id
      title
      description
      status
      isCompleted
      lastModified
      labelId
      label {
        id
        name
        color
      }
    }
  }
`;

export const ADD_TASK = gql`
  mutation AddTask($title: String!, $description: String!, $labelId: Int, $status: String!) {
    addTask(title: $title, description: $description, labelId: $labelId, status: $status) {
      id
      title
      description
      status
      isCompleted
      lastModified
      labelId
      label {
        id
        name
        color
      }
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: Int!) {
    deleteTask(id: $id)
  }
`;

export const UPDATE_TASK_DETAILS = gql`
  mutation UpdateTaskDetails($id: Int!, $title: String, $description: String, $labelId: Int) {
    updateTaskDetails(id: $id, title: $title, description: $description, labelId: $labelId) {
      id
      title
      description
      status
      isCompleted
      lastModified
      labelId
      label {
        id
        name
        color
      }
    }
  }
`; 