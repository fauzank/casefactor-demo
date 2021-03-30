/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPerson = /* GraphQL */ `
  mutation CreatePerson(
    $PersonId: String!
    $FirstName: String!
    $LastName: String!
    $DOB: AWSDateTime!
    $PhoneNo: String!
    $Email: AWSEmail!
    $GovId: String!
    $GovIdType: String!
    $Address: String!
    $Role: String!
  ) {
    createPerson(
      PersonId: $PersonId
      FirstName: $FirstName
      LastName: $LastName
      DOB: $DOB
      PhoneNo: $PhoneNo
      Email: $Email
      GovId: $GovId
      GovIdType: $GovIdType
      Address: $Address
      Role: $Role
    ) {
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
export const updatePerson = /* GraphQL */ `
  mutation UpdatePerson(
    $id: ID!
    $PersonId: String!
    $FirstName: String!
    $LastName: String!
    $DOB: AWSDateTime!
    $PhoneNo: String!
    $Email: AWSEmail!
    $GovId: String!
    $GovIdType: String!
    $Address: String!
    $Role: String!
  ) {
    updatePerson(
      id: $id
      PersonId: $PersonId
      FirstName: $FirstName
      LastName: $LastName
      DOB: $DOB
      PhoneNo: $PhoneNo
      Email: $Email
      GovId: $GovId
      GovIdType: $GovIdType
      Address: $Address
      Role: $Role
    ) {
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
export const createCase = /* GraphQL */ `
  mutation CreateCase(
    $CaseTitle: String!
    $CaseDate: AWSDateTime!
    $Description: String!
    $LeadInvestigator: String!
    $Location: String!
    $IncidentType: String!
    $CaseClosed: Boolean!
  ) {
    createCase(
      CaseTitle: $CaseTitle
      CaseDate: $CaseDate
      Description: $Description
      LeadInvestigator: $LeadInvestigator
      Location: $Location
      IncidentType: $IncidentType
      CaseClosed: $CaseClosed
    ) {
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
export const updateCase = /* GraphQL */ `
  mutation UpdateCase(
    $id: ID!
    $CaseTitle: String!
    $CaseDate: AWSDateTime!
    $Description: String!
    $LeadInvestigator: String!
    $Location: String!
    $IncidentType: String!
    $CaseClosed: Boolean!
  ) {
    updateCase(
      id: $id
      CaseTitle: $CaseTitle
      CaseDate: $CaseDate
      Description: $Description
      LeadInvestigator: $LeadInvestigator
      Location: $Location
      IncidentType: $IncidentType
      CaseClosed: $CaseClosed
    ) {
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
export const createExhibit = /* GraphQL */ `
  mutation CreateExhibit(
    $CaseId: ID!
    $Name: String!
    $Description: String!
    $DocumentType: String!
    $BucketURL: String
    $Hash: String
  ) {
    createExhibit(
      CaseId: $CaseId
      Name: $Name
      Description: $Description
      DocumentType: $DocumentType
      BucketURL: $BucketURL
      Hash: $Hash
    ) {
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
export const updateExhibit = /* GraphQL */ `
  mutation UpdateExhibit(
    $id: ID!
    $CaseId: ID!
    $Name: String!
    $Description: String!
    $DocumentType: String!
    $BucketURL: String
    $Hash: String
  ) {
    updateExhibit(
      id: $id
      CaseId: $CaseId
      Name: $Name
      Description: $Description
      DocumentType: $DocumentType
      BucketURL: $BucketURL
      Hash: $Hash
    ) {
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
export const assignExhibit = /* GraphQL */ `
  mutation AssignExhibit($ExhibitId: ID!, $IssuedTo: String!) {
    assignExhibit(ExhibitId: $ExhibitId, IssuedTo: $IssuedTo) {
      id
      ExhibitId
      IssueDate
      IssuedTo
    }
  }
`;
