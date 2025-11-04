import axios from 'axios';
import { store } from '../redux/store';
import { Buffer } from "buffer"; 
export function getToken() {
  const baseURL: any = store?.getState().login.token;
  return baseURL;
}

export function getBaseURL() {
  const baseURL: any = store?.getState().login.tanent;
  return baseURL;
}

export async function fetchCurrentUser() {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;
    const email: any = state?.login?.email;
    const apiUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMUsers')/items/?$filter=Email eq '${email}'`;
    const res = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json;odata=nometadata",
        "odata-version": "",
        Authorization: `Bearer ${token}`,
      },
    });

    return res?.data?.value?.[0] ?? [];
  } catch (error) {
    console.error('Error fetching current user:', error);
    return [];
  }
}

export async function fetchUsers() {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;
    const email: any = state?.login?.email;
    const apiUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMUsers')/items?$top=5000&$select=ID,Title,Department,Email,Users/Id,Users/Title,Users/EMail,Users/UserName&$expand=Users`;
    const res = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json;odata=nometadata",
        "odata-version": "",
        Authorization: `Bearer ${token}`,
      },
    });    

    return res?.data?.value ?? [];
  } catch (error) {
    console.error('Error fetching current user:', error);
    return [];
  }
}

export async function fetchMyTickets() {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;
    const userID: any = state?.login?.user?.UsersId;

    const apiUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMTickets')/items?$top=5000&$select=*,AssignedTo/Title&$expand=AssignedTo&$filter=AssignedTo/Id eq ${userID}`;

    const res = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json;odata=nometadata",
        "odata-version": "",
        Authorization: `Bearer ${token}`,
      },
    });

    return res?.data?.value ?? [];
  } catch (error) {
    console.error('Error fetching my tickets:', error);
    return [];
  }
}

export async function fetchMyOpenTickets() {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;
    const userID: any = state?.login?.user?.UsersId;

    const apiUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMTickets')/items?$top=5000&$select=*,AssignedTo/Title&$expand=AssignedTo&$filter=AssignedTo/Id eq ${userID} and (Status eq 'Open')`;

    const res = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json;odata=nometadata",
        "odata-version": "",
        Authorization: `Bearer ${token}`,
      },
    });

    return res?.data?.value ?? [];
  } catch (error) {
    console.error('Error fetching my open tickets:', error);
    return [];
  }
}

export async function fetchMyClosedTickets() {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;
    const userID: any = state?.login?.user?.UsersId;

    const apiUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMTickets')/items?$top=5000&$select=*,AssignedTo/Title&$expand=AssignedTo&$filter=AssignedTo/Id eq ${userID} and (Status eq 'Closed')`;

    const res = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json;odata=nometadata",
        "odata-version": "",
        Authorization: `Bearer ${token}`,
      },
    });
    
    return res?.data?.value ?? [];
  } catch (error) {
    console.error('Error fetching my closed tickets:', error);
    return [];
  }
}

export async function fetchMyResolvedTickets() {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;
    const userID: any = state?.login?.user?.UsersId;

    const apiUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMTickets')/items?$top=5000&$select=*,AssignedTo/Title&$expand=AssignedTo&$filter=AssignedTo/Id eq ${userID} and (Status eq 'Resolved')`;

    const res = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json;odata=nometadata",
        "odata-version": "",
        Authorization: `Bearer ${token}`,
      },
    });

    return res?.data?.value ?? [];
  } catch (error) {
    console.error('Error fetching my resolved tickets:', error);
    return [];
  }
}

export async function fetchTeamsTickets() {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;

    const apiUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMTickets')/items?$top=5000&$select=*,AssignedTo/Title&$expand=AssignedTo&$filter=(AssignedTo ne null) and ((ApprovalStatus eq 'Approved') or (ApprovalStatus eq null))`;
    
    const res = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json;odata=nometadata",
        "odata-version": "",
        Authorization: `Bearer ${token}`,
      },
    });

    return res?.data?.value ?? [];
  } catch (error) {
    console.error('Error fetching teams tickets:', error);
    return [];
  }
}

export async function fetchTeamsOpenTickets() {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;

    const apiUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMTickets')/items?$top=5000&$select=*,AssignedTo/Title&$expand=AssignedTo&$filter=(AssignedTo ne null) and ((ApprovalStatus eq 'Approved') or (ApprovalStatus eq null)) and (Status eq 'Open')`;
    
    const res = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json;odata=nometadata",
        "odata-version": "",
        Authorization: `Bearer ${token}`,
      },
    });

    return res?.data?.value ?? [];
  } catch (error) {
    console.error('Error fetching teams open tickets:', error);
    return [];
  }
}

export async function fetchTeamsClosedTickets() {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;

    const apiUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMTickets')/items?$top=5000&$select=*,AssignedTo/Title&$expand=AssignedTo&$filter=(AssignedTo ne null) and ((ApprovalStatus eq 'Approved') or (ApprovalStatus eq null)) and (Status eq 'Closed')`;
    
    const res = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json;odata=nometadata",
        "odata-version": "",
        Authorization: `Bearer ${token}`,
      },
    });

    return res?.data?.value ?? [];
  } catch (error) {
    console.error('Error fetching teams closed tickets:', error);
    return [];
  }
}

export async function fetchTeamsResolvedTickets() {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;

    const apiUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMTickets')/items?$top=5000&$select=*,AssignedTo/Title&$expand=AssignedTo&$filter=(AssignedTo ne null) and ((ApprovalStatus eq 'Approved') or (ApprovalStatus eq null)) and (Status eq 'Resolved')`;
    
    const res = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json;odata=nometadata",
        "odata-version": "",
        Authorization: `Bearer ${token}`,
      },
    });

    return res?.data?.value ?? [];
  } catch (error) {
    console.error('Error fetching teams resolved tickets:', error);
    return [];
  }
}

export async function fetchImage(userEmail: string, size: "M" = "M") {
  const state: any = store?.getState();
  const token: any = state?.login?.token;
  const baseURL: any = state?.login?.tanent;

  if (!userEmail || !userEmail?.trim()) {
    return "";
  }

  const url = `${baseURL}/_layouts/15/userphoto.aspx?accountname=${encodeURIComponent(userEmail)}&size=${size}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const blob = await response.blob();

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    return base64;
  } catch (error) {
    console.error("Error fetching user photo:", error);
    return null;
  }
}


export async function fetchUnassignedTickets() {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;

    const apiUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMTickets')/items?$top=5000&$select=*,AssignedTo/Title&$expand=AssignedTo&$filter=(AssignedTo eq null) and ((ApprovalStatus eq 'Approved') or (ApprovalStatus eq null)) and (Status ne 'Closed') and (Status ne 'Resolved') and (Status ne 'Open')`;

    const res = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json;odata=nometadata",
        "odata-version": "",
        Authorization: `Bearer ${token}`,
      },
    });

    return res?.data?.value ?? [];
  } catch (error) {
    console.error('Error fetching unassigned tickets:', error);
    return [];
  }
}

export async function fetchMyRequestsTickets() {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;
    const userID: any = state?.login?.user?.UsersId;

    const apiUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMTickets')/items?$top=5000&$select=*,AssignedTo/Title&$expand=AssignedTo&$filter=(Requester/Id eq ${userID})`;

    const res = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json;odata=nometadata",
        "odata-version": "",
        Authorization: `Bearer ${token}`,
      },
    });

    return res?.data?.value ?? [];
  } catch (error) {
    console.error('Error fetching my requests tickets:', error);
    return [];
  }
}

export async function fetchMyOpenRequestsTickets() {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;
    const userID: any = state?.login?.user?.UsersId;

    const apiUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMTickets')/items?$top=5000&$select=*,AssignedTo/Title&$expand=AssignedTo&$filter=(Requester/Id eq ${userID}) and (Status eq 'Open')`;

    const res = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json;odata=nometadata",
        "odata-version": "",
        Authorization: `Bearer ${token}`,
      },
    });

    return res?.data?.value ?? [];
  } catch (error) {
    console.error('Error fetching my open requests tickets:', error);
    return [];
  }
}

export async function fetchMyClosedRequestsTickets() {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;
    const userID: any = state?.login?.user?.UsersId;

    const apiUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMTickets')/items?$top=5000&$select=*,AssignedTo/Title&$expand=AssignedTo&$filter=(Requester/Id eq ${userID}) and (Status eq 'Closed')`;

    const res = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json;odata=nometadata",
        "odata-version": "",
        Authorization: `Bearer ${token}`,
      },
    });

    return res?.data?.value ?? [];
  } catch (error) {
    console.error('Error fetching my closed requests tickets:', error);
    return [];
  }
}

export async function fetchMyResolvedRequestsTickets() {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;
    const userID: any = state?.login?.user?.UsersId;

    const apiUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMTickets')/items?$top=5000&$select=*,AssignedTo/Title&$expand=AssignedTo&$filter=(Requester/Id eq ${userID}) and (Status eq 'Resolved')`;

    const res = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json;odata=nometadata",
        "odata-version": "",
        Authorization: `Bearer ${token}`,
      },
    });

    return res?.data?.value ?? [];
  } catch (error) {
    console.error('Error fetching my resolved requests tickets:', error);
    return [];
  }
}

export async function fetchMyApprovalTickets() {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;
    const userID: any = state?.login?.user?.UsersId;

    const apiUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMTickets')/items?$top=5000&$select=*,AssignedTo/Title&$expand=AssignedTo&$filter=(ApprovalStatus ne null)`;

    const res = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json;odata=nometadata",
        "odata-version": "",
        Authorization: `Bearer ${token}`,
      },
    });

    return res?.data?.value ?? [];
  } catch (error) {
    console.error('Error fetching my approval tickets:', error);
    return [];
  }
}

export async function fetchMyPendingApprovalTickets() {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;

    const apiUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMTickets')/items?$top=5000&$select=*,AssignedTo/Title&$expand=AssignedTo&$filter=(ApprovalStatus ne null) and (ApprovalStatus eq 'Pending')`;

    const res = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json;odata=nometadata",
        "odata-version": "",
        Authorization: `Bearer ${token}`,
      },
    });

    return res?.data?.value ?? [];
  } catch (error) {
    console.error('Error fetching my pending approval tickets:', error);
    return [];
  }
}

export async function fetchMyApprovedApprovalTickets() {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;
    const userID: any = state?.login?.user?.UsersId;

    const apiUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMTickets')/items?$top=5000&$select=*,AssignedTo/Title&$expand=AssignedTo&$filter=(ApprovalStatus ne null) and (ApprovalStatus eq 'Approved')`;

    const res = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json;odata=nometadata",
        "odata-version": "",
        Authorization: `Bearer ${token}`,
      },
    });

    return res?.data?.value ?? [];
  } catch (error) {
    console.error('Error fetching my approved approval tickets:', error);
    return [];
  }
}

export async function fetchMyRejectedApprovalTickets() {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;
    const userID: any = state?.login?.user?.UsersId;

    const apiUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMTickets')/items?$top=5000&$select=*,AssignedTo/Title&$expand=AssignedTo&$filter=(ApprovalStatus ne null) and (ApprovalStatus eq 'Rejected')`;

    const res = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json;odata=nometadata",
        "odata-version": "",
        Authorization: `Bearer ${token}`,
      },
    });

    return res?.data?.value ?? [];
  } catch (error) {
    console.error('Error fetching my rejected approval tickets:', error);
    return [];
  }
}

export async function fetchMyCancelledApprovalTickets() {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;
    const userID: any = state?.login?.user?.UsersId;

    const apiUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMTickets')/items?$top=5000&$select=*,AssignedTo/Title&$expand=AssignedTo&$filter=(ApprovalStatus ne null) and (ApprovalStatus eq 'Cancelled')`;

    const res = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json;odata=nometadata",
        "odata-version": "",
        Authorization: `Bearer ${token}`,
      },
    });

    return res?.data?.value ?? [];
  } catch (error) {
    console.error('Error fetching my cancelled approval tickets:', error);
    return [];
  }
}

export async function fetchHR365HDMTicketFieldSettings() {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;
    const userID: any = state?.login?.user?.UsersId;

    const apiUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMTicketFieldSettings')/items`;

    const res = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json;odata=nometadata",
        "odata-version": "",
        Authorization: `Bearer ${token}`,
      },
    });

    return res?.data?.value?.[0] ?? [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

export async function fetchHR365HDMCustomColumns() {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;
    const userID: any = state?.login?.user?.UsersId;

    const apiUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMCustomColumns')/items`;

    const res = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json;odata=nometadata",
        "odata-version": "",
        Authorization: `Bearer ${token}`,
      },
    });
    return res?.data?.value ?? [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

export async function fetchHR365HDMServices() {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;
    const userID: any = state?.login?.user?.UsersId;

    const apiUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMServices')/items`;

    const res = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json;odata=nometadata",
        "odata-version": "",
        Authorization: `Bearer ${token}`,
      },
    });

    return res?.data?.value ?? [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

export async function fetchHR365HDMSubServices() {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;
    const userID: any = state?.login?.user?.UsersId;

    const apiUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMSubServices')/items`;

    const res = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json;odata=nometadata",
        "odata-version": "",
        Authorization: `Bearer ${token}`,
      },
    });

    return res?.data?.value ?? [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

export async function fetchHR365HDMSubServicesLevelWise() {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;
    const userID: any = state?.login?.user?.UsersId;

    const apiUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMSubServicesLevelWise')/items`;

    const res = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json;odata=nometadata",
        "odata-version": "",
        Authorization: `Bearer ${token}`,
      },
    });

    return res?.data?.value ?? [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

export async function fetchHR365HDMPriority() {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;
    const userID: any = state?.login?.user?.UsersId;

    const apiUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMPriority')/items?$select=Title,DefaultType`;

    const res = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json;odata=nometadata",
        "odata-version": "",
        Authorization: `Bearer ${token}`,
      },
    });

    return res?.data?.value ?? [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

export async function fetchHR365HDMSettings() {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;
    const userID: any = state?.login?.user?.UsersId;

    const apiUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMSettings')/items`;

    const res = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json;odata=nometadata",
        "odata-version": "",
        Authorization: `Bearer ${token}`,
      },
    });

    return res?.data?.value?.[0] ?? [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

export async function fetchHR365HDMDepartments() {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;
    const userID: any = state?.login?.user?.UsersId;

    const apiUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMDepartments')/items?$select=*,Supervisor1/Title,Supervisor1/Id&$filter=EscalationTeam%20eq%20%27No%27&$expand=Supervisor1`;

    const res = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json;odata=nometadata",
        "odata-version": "",
        Authorization: `Bearer ${token}`,
      },
    });

    return res?.data?.value ?? [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

export async function fetchHR365AMXAssets() {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;
    const email: any = state?.login?.email;

    const apiUrl = `${baseURL}/_api/web/lists/getbytitle('HR365AMXAssets')/items?$select=*,LastLoginUser,LastLoginUserDate,AssignedTo/Title&$expand=AssignedTo/ID&$filter=AssignToEmailId eq '${email}'`;

    const res = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json;odata=nometadata",
        "odata-version": "",
        Authorization: `Bearer ${token}`,
      },
    });

    return res?.data?.value ?? [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

export async function searchGraphUsers() {
  try {
    const state: any = store?.getState();
    const token: string = state?.login?.tokenGraph;
    
    const filter =
      "(startswith(displayName,'sachin') or startswith(mail,'sachin') or startswith(userPrincipalName,'sachin')) and accountEnabled eq true";

    const graphUrl = `https://graph.microsoft.com/v1.0/users`;

    const res = await axios.get(graphUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    return res?.data?.value ?? [];
  } catch (error) {
    console.error("searchGraphUsers error:", error.response?.data || error);
    return [];
  }
}

export async function searchGraphUsersData(name: string) {
  try {
    const state: any = store?.getState();
    const token: string = state?.login?.tokenGraph;
    
    const filter =
      `(startswith(displayName, '${name}') or startswith(mail, '${name}') or startswith(userPrincipalName, '${name}')) and accountEnabled eq true`;

    const graphUrl = `https://graph.microsoft.com/v1.0/users?$filter=${filter}&$select=id,displayName,mail,userPrincipalName&$top=10`;

    const res = await axios.get(graphUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    return res?.data?.value ?? [];
  } catch (error) {
    console.error("searchGraphUsers error:", error.response?.data || error);
    return [];
  }
}

