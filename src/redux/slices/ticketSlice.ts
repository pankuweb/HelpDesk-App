import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TicketState {
  tickets: any[];
  unAssignedTickets: any[];
  teamsTickets: any[];
  myTickets: any[];
  myRequests: any[];
  approvals: any[];
}

const initialState: TicketState = {
  tickets: [],
  unAssignedTickets: [],
  teamsTickets: {
    all: [],
    open: [],
    closed: [],
    resolved: [],
  },
  myTickets: {
    all: [],
    open: [],
    closed: [],
    resolved: [],
  },
  myRequests: {
    all: [],
    open: [],
    closed: [],
    resolved: [],
  },
  approvals: {
    all: [],
    pending: [],
    approved: [],
    rejected: [],
    cancelled: [],
  },
};

const ticketSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    setUnAssignedTickets: (state, action: PayloadAction<any[]>) => {
      state.unAssignedTickets = action.payload;
    },
    setOpenTeamsTickets: (state, action: PayloadAction<any[]>) => {
      state.teamsTickets.open = action.payload;
    },
    setClosedTeamsTickets: (state, action: PayloadAction<any[]>) => {
      state.teamsTickets.closed = action.payload;
    },
    setTeamsTickets: (state, action: PayloadAction<any[]>) => {
      state.teamsTickets.all = action.payload;
    },
    setResolvedTeamsTickets: (state, action: PayloadAction<any[]>) => {
      state.teamsTickets.resolved = action.payload;
    },
    setMyOpenTickets: (state, action: PayloadAction<any[]>) => {
      state.myTickets.open = action.payload;
    },
    setMyTickets: (state, action: PayloadAction<any[]>) => {
      state.myTickets.all = action.payload;
    },
    setMyClosedTickets: (state, action: PayloadAction<any[]>) => {
      state.myTickets.closed = action.payload;
    },
    setMyResolvedTickets: (state, action: PayloadAction<any[]>) => {
      state.myTickets.resolved = action.payload;
    },
    setMyRequests: (state, action: PayloadAction<any[]>) => {
      state.myRequests.all = action.payload;
    },
    setMyOpenRequests: (state, action: PayloadAction<any[]>) => {
      state.myRequests.open = action.payload;
    },
    setMyClosedRequests: (state, action: PayloadAction<any[]>) => {
      state.myRequests.closed = action.payload;
    },
    setMyResolvedRequests: (state, action: PayloadAction<any[]>) => {
      state.myRequests.resolved = action.payload;
    },
    setApprovals: (state, action: PayloadAction<any[]>) => {
      state.approvals.all = action.payload;
    },
    setPendingApprovals: (state, action: PayloadAction<any[]>) => {
      state.approvals.pending = action.payload;
    },
    setApprovedApprovals: (state, action: PayloadAction<any[]>) => {
      state.approvals.approved = action.payload;
    },
    setRejectedApprovals: (state, action: PayloadAction<any[]>) => {
      state.approvals.rejected = action.payload;
    },
    setCancelledApprovals: (state, action: PayloadAction<any[]>) => {
      state.approvals.cancelled = action.payload;
    },
    clearAllTickets: (state) => {
      state.tickets = [];
      state.unAssignedTickets = [];
      state.teamsTickets = {
        open: [],
        closed: [],
        resolved: [],
      };
      state.myTickets = {
        open: [],
        closed: [],
        resolved: [],
      };
      state.myRequests = {
        open: [],
        closed: [],
        resolved: [],
      };
      state.approvals = {
        all: [],
        pending: [],
        approved: [],
        rejected: [],
        cancelled: [],
      };
    },
  },
});

export const {
  setMyTickets,
  setUnAssignedTickets,
  setTeamsTickets,
  setMyOpenTickets,
  setMyResolvedTickets,
  setMyClosedTickets,
  setOpenTeamsTickets,
  setClosedTeamsTickets,
  setResolvedTeamsTickets,
  setMyRequests,
  setMyOpenRequests,
  setMyClosedRequests,
  setMyResolvedRequests,
  setApprovals,
  setPendingApprovals,
  setApprovedApprovals,
  setCancelledApprovals,
  setRejectedApprovals,
  clearAllTickets,
} = ticketSlice.actions;

export default ticketSlice.reducer;
