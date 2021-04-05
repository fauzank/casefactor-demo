/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPerson = /* GraphQL */ `
  query GetPerson($PersonId: String!) {
    getPerson(PersonId: $PersonId) {
      id
      PersonId
      FirstName
      LastName
      DOB
      PhoneNo
      Email
      GovId
      GovIdType
      Address
      Role
    }
  }
`;
export const getCase = /* GraphQL */ `
  query GetCase($CaseId: String!) {
    getCase(CaseId: $CaseId) {
      id
      CaseTitle
      CaseDate
      Description
      LeadInvestigator
      Location
      IncidentType
      CaseClosed
    }
  }
`;
export const getCasesByPerson = /* GraphQL */ `
  query GetCasesByPerson($PersonId: String!) {
    getCasesByPerson(PersonId: $PersonId) {
      items {
        id
        CaseTitle
        CaseDate
        Description
        LeadInvestigator
        Location
        IncidentType
        CaseClosed
      }
    }
  }
`;
export const getExhibit = /* GraphQL */ `
  query GetExhibit($ExhibitId: ID!) {
    getExhibit(ExhibitId: $ExhibitId) {
      id
      CaseId
      Name
      Description
      DocumentType
      BucketURL
      Hash
    }
  }
`;
export const getExhibitsByCase = /* GraphQL */ `
  query GetExhibitsByCase($CaseId: ID!) {
    getExhibitsByCase(CaseId: $CaseId) {
      items {
        id
        CaseId
        Name
        Description
        DocumentType
        BucketURL
        Hash
      }
    }
  }
`;
export const getMovementsByExhibit = /* GraphQL */ `
  query GetMovementsByExhibit($ExhibitId: ID!) {
    getMovementsByExhibit(ExhibitId: $ExhibitId) {
      items {
        id
        ExhibitId
        IssueDate
        IssuedTo
        IssuedToName
      }
    }
  }
`;
export const getPersonList = /* GraphQL */ `
  query GetPersonList($nullValue: String) {
    getPersonList(nullValue: $nullValue) {
      items {
        id
        PersonId
        FullName
      }
    }
  }
`;
export const getPersonHistory = /* GraphQL */ `
  query GetPersonHistory($PersonId: String) {
    getPersonHistory(PersonId: $PersonId) {
      items {
        version
        txTime
        FirstName
        LastName
        DOB
        PhoneNo
        Email
        GovId
        GovIdType
        Address
        Role
      }
    }
  }
`;
export const verifyExhibit = /* GraphQL */ `
  query VerifyExhibit($ExhibitId: ID!) {
    verifyExhibit(ExhibitId: $ExhibitId)
  }
`;
export const extractText = /* GraphQL */ `
  query ExtractTextAnalysis($ExhibitId: ID!, $DocumentURL: String) {
    extractText(ExhibitId: $ExhibitId, DocumentURL: $DocumentURL) {
      ExhibitId
      Entities {
        Score
        Type
        Text
        BeginOffset
        EndOffset
      }
      KeyPhrases {
        Score
        Text
        BeginOffset
        EndOffset
      }
      Body
    }
  }
`;
export const transcribeAudio = /* GraphQL */ `
  query TranscribeAudio($ExhibitId: ID!, $DocumentURL: String) {
    transcribeAudio(ExhibitId: $ExhibitId, DocumentURL: $DocumentURL) {
      ExhibitId
      Entities {
        Score
        Type
        Text
        BeginOffset
        EndOffset
      }
      KeyPhrases {
        Score
        Text
        BeginOffset
        EndOffset
      }
      Body
    }
  }
`;
