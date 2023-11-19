export const GET_COLUMS = (boardId) => `query {
    boards (ids: ${boardId}) {
      columns {
        id
        title
      }		
    }
  }`;
