import axios from 'axios';
import { store } from '../redux/store';
import RNFS from "react-native-fs";
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

    return res?.data?.value?.[0] ?? {};
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
    const apiUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMUsers')/items?$top=5000`;
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

    const apiUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMTickets')/items?$top=5000&$select=*,AssignedTo/Title&$expand=AssignedTo&$filter=(AssignedTo eq null) and ((ApprovalStatus eq 'Approved') or (ApprovalStatus eq null)) and (Status ne 'Closed') and (Status ne 'Resolved') and (Status ne 'Open')&$orderby=Created desc`;

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

    return res?.data?.value?.[0] ?? {};
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

    return res?.data?.value?.[0] ?? {};
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

    const apiUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMDepartments')/items`;

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
        console.log(res, 'res');

    return res?.data?.value ?? [];
  } catch (error) {
    console.error("searchGraphUsers error:", error.response?.data || error);
    return [];
  }
}

export async function getSiteUsers() {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;
    const userID: any = state?.login?.user?.UsersId;

    const apiUrl = `${baseURL}/_api/Web/SiteUsers`;

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

export async function getSiteEnsureUsers(email: string) {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;

    const ensureUrl = `${baseURL}/_api/web/ensureuser`;

    const response = await axios.post(
      ensureUrl,
      {
        logonName: `i:0#.f|membership|${email}`,
      },
      {
        headers: {
          Accept: "application/json;odata=nometadata",
          "Content-Type": "application/json;odata=nometadata",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response?.data;
  } catch (error: any) {
    console.error("Error in getSiteEnsureUsers:", error?.response?.data || error);
    return null;
  }
}

export async function getFormDigest() {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;

    const digestUrl = `${baseURL}/_api/contextinfo`;

    const response = await axios.post(
      digestUrl,
      {},
      {
        headers: {
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const formDigest =
      response?.data?.d?.GetContextWebInformation?.FormDigestValue;

    if (!formDigest) {
      throw new Error("FormDigestValue not found in response");
    }

    return formDigest;
  } catch (error: any) {
    console.error("Error in getFormDigest:", error?.response?.data || error);
    return null;
  }
}

export async function uploadAttachments(
  listName: string,
  itemId: number,
  files: any[]
): Promise<void> {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;

    const formDigest = await getFormDigest();

    for (const file of files) {
      try {
        const attachmentUrl = `${baseURL}/_api/web/lists/getbytitle('${listName}')/items(${itemId})/AttachmentFiles/add(FileName='${encodeURIComponent(
          file.fileName || file.name
        )}')`;

        const base64Data = await RNFS.readFile(file.uri, 'base64');
        const binaryData = Buffer.from(base64Data, 'base64');

        const response = await axios.post(attachmentUrl, binaryData, {
          headers: {
            Accept: "application/json;odata=verbose",
            "Content-Type": "application/octet-stream",
            Authorization: `Bearer ${token}`,
            "X-RequestDigest": formDigest,
          },
        });

        console.log(`Successfully uploaded: ${file.fileName || file.name}`, response.data);
      } catch (fileError: any) {
        console.error(`Error uploading ${file.fileName || file.name}:`, fileError?.response?.data || fileError);
      }
    }
  } catch (error: any) {
    console.error("Error in uploadAttachments:", error?.response?.data || error);
  }
}

export async function fetchHR365HDMRequestType() {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;
    const userID: any = state?.login?.user?.UsersId;

    const apiUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMRequestType')/items`;

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

export async function fetchHR365HDMEmailTemplates(title) {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;
    const userID: any = state?.login?.user?.UsersId;

    const apiUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMEmailNotifications')/items`;

    const res = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json;odata=nometadata",
        "odata-version": "",
        Authorization: `Bearer ${token}`,
      },
    });

    const FilteredTemplate = res?.data?.value?.filter(item=> item.Title === title)

    return FilteredTemplate?.[0] ?? {};
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

export async function fetchAttachments(
  listName: string,
  itemId: number
): Promise<any[]> {
  try {
    const state: any = store?.getState();
    const token: any = state?.login?.token;
    const baseURL: any = state?.login?.tanent;

    const url = `${baseURL}/_api/web/lists/getbytitle('${listName}')/items(${itemId})?$select=Id,AttachmentFiles&$expand=AttachmentFiles`;

    const response = await axios.get(url, {
      headers: {
        Accept: "application/json;odata=verbose",
        Authorization: `Bearer ${token}`,
      },
    });

    const files = response?.data?.d?.AttachmentFiles?.results || [];

    const attachments = files.map((file: any) => ({
      fileName: file.FileName,
      serverRelativeUrl: file.ServerRelativeUrl,
      absoluteUrl: `${baseURL}${file.ServerRelativeUrl}`,
    }));

    console.log("Fetched attachments:", attachments);
    return attachments;
  } catch (error: any) {
    console.error("Error while fetching attachments:", error?.response?.data || error);
    return [];
  }
}

export async function PostLinkReportData(event,FormattedDataForLink) {
    
  const state: any = store?.getState();
  const baseURL: any = state?.login?.tanent;
  const token: any = state?.login?.token;

  try {
    for (const ele of FormattedDataForLink ?? []) {
      const url = `${baseURL}/_api/web/lists/getbytitle('HR365HDMMTEmailsReport')/items`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json;odata=nometadata',
          'Content-Type': 'application/json;odata=nometadata',
          'odata-version': '',
          Authorization: `Bearer ${token}`,
          'IF-MATCH': '*',
          'X-HTTP-Method': 'POST',
        },
        body: JSON.stringify(ele),
      });

      if (!response.ok) {
        console.error(
          "Unexpected response:",
          response.status,
          await response.text()
        );
        event.completed({ allowEvent: true });
        return;
      }

    await response.json();
  }
  } catch (error) {
    console.error("Error in PostSPData:", error);
    event.completed?.({ allowEvent: true });
  }
}

export async function PostSPData(event, subject, body, CC,deptCode,NewTicketID,AllLinks,FormattedDataForLink) {
  const state: any = store?.getState();
  const baseURL: any = state?.login?.tanent;
  const token: any = state?.login?.token;

  try {
    const requestBody = {
      Title: event?.emailUniqueId,
      EmailUniqueID: event?.emailUniqueId,
      Subject: subject,
      TicketId: NewTicketID,
      toWho: event?.userId,
      ByWho: event?.senderId,
      Body: body,
      OpenedEmails: "0",
      TeamCode: deptCode,
    };

    const url = `${baseURL}/_api/web/lists/getbytitle('HR365HDMMTEmails')/items`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json;odata=nometadata',
          'Content-Type': 'application/json;odata=nometadata',
          'odata-version': '',
          Authorization: `Bearer ${token}`,
          'IF-MATCH': '*',
          'X-HTTP-Method': 'POST',
        },
        body: JSON.stringify(requestBody),
      });

    if (response.ok) {      
      if (AllLinks?.length > 0) {
        await PostLinkReportData(event, FormattedDataForLink);
      }

      return await response.json();
    } else {
      console.error("POSTSPDATA ERROR OCCURRED:", response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error in PostSPData:", error);
    event.completed?.({ allowEvent: true });
  }
}


export async function postMailTrackerData(FinalData, requestData,sub,body,CCMailsForSpUILITY,deptCode,NewTicketID,AllLinks=[], FormattedDataForLink) {

  try {
    const response = await fetch(`https://mt.msapps365.com/api/v1/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(FinalData),
    });

    if (!response.ok) {
      console.log("MailTracker API failed:", response.status, response.statusText);
      return;
    }

    await PostSPData(
      requestData,
      sub,
      body,
      [...new Set(CCMailsForSpUILITY?.flat())],
      deptCode,
      NewTicketID,
      AllLinks,
      FormattedDataForLink
    );

  } catch (error) {
    console.log("Error occurred:", error);
  }
}

export async function PostHR365HDMExternalEmailData(finalTemplate) {
  const state: any = store?.getState();
  const baseURL: any = state?.login?.tanent;
  const token: any = state?.login?.token;

  try {
    const url = `${baseURL}/_api/web/lists/getbytitle('HR365HDMExternalEmailData')/items`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json;odata=nometadata',
          'Content-Type': 'application/json;odata=nometadata',
          'odata-version': '',
          Authorization: `Bearer ${token}`,
          'IF-MATCH': '*',
          'X-HTTP-Method': 'POST',
        },
        body: JSON.stringify(finalTemplate),
      });

    if (response.ok) {      
      console.log('okkkkkl');
      
    } else {
      console.error("error:", response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function sendGraphMail(emailMessage) {
  try {
    const state: any = store?.getState();
    const token: string = state?.login?.tokenGraph;

    const graphUrl = `https://graph.microsoft.com/v1.0/me/sendMail`;

    const res = await axios.post(graphUrl, emailMessage,{
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    return res?.data?.value ?? [];
  } catch (error) {
    console.error("sendGraphMail error:", error.response?.data || error);
    return [];
  }
}