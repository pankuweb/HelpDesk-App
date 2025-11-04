import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setMyClosedTickets, setMyOpenTickets, setMyResolvedTickets, setOpenTeamsTickets, setTeamsTickets, setMyTickets, setClosedTeamsTickets, setResolvedTeamsTickets, setUnAssignedTickets, setMyOpenRequests, setMyRequests, setMyClosedRequests, setMyResolvedRequests, setApprovals, setPendingApprovals, setApprovedApprovals, setRejectedApprovals, setCancelledApprovals } from "../redux/slices/ticketSlice";
import { fetchTeamsTickets, fetchMyTickets, fetchMyOpenTickets, fetchMyClosedTickets, fetchMyResolvedTickets, fetchTeamsOpenTickets, fetchTeamsClosedTickets, fetchTeamsResolvedTickets, fetchUnassignedTickets, fetchMyOpenRequestsTickets, fetchMyRequestsTickets, fetchMyClosedRequestsTickets, fetchMyResolvedRequestsTickets, fetchMyApprovalTickets, fetchMyPendingApprovalTickets, fetchMyApprovedApprovalTickets, fetchMyRejectedApprovalTickets, fetchMyCancelledApprovalTickets } from "../backend/RequestAPI";
import { useEffect } from "react";

export function useMyTickets() {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      const data = await fetchMyTickets();
      return data;
    },
    onError: (err) => console.error("fetchMyTickets error:", err),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query?.isSuccess && query?.data?.length) {
      dispatch(setMyTickets(query?.data));
    }
  }, [query?.isSuccess, query?.data, dispatch]);

  return {
    ...query,
    refetch: query?.refetch,
  };
}

export function useMyOpenTickets() {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["myopentickets"],
    queryFn: async () => {
      const data = await fetchMyOpenTickets();
      return data;
    },
    onError: (err) => console.error("fetchMyTickets error:", err),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query?.isSuccess && query?.data?.length) {
      dispatch(setMyOpenTickets(query?.data));
    }
  }, [query?.isSuccess, query?.data, dispatch]);

  return {
    ...query,
    refetch: query?.refetch,
  };
}

export function useMyClosedTickets() {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["myclosedtickets"],
    queryFn: async () => {
      const data = await fetchMyClosedTickets();
      return data;
    },
    onError: (err) => console.error("fetchMyTickets error:", err),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query?.isSuccess && query?.data?.length) {
      dispatch(setMyClosedTickets(query?.data));
    }
  }, [query?.isSuccess, query?.data, dispatch]);

  return {
    ...query,
    refetch: query?.refetch,
  };
}

export function useMyResolvedTickets() {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["myresolvedtickets"],
    queryFn: async () => {
      const data = await fetchMyResolvedTickets();
      return data;
    },
    onError: (err) => console.error("fetchMyTickets error:", err),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query?.isSuccess && query?.data?.length) {
      dispatch(setMyResolvedTickets(query?.data));
    }
  }, [query?.isSuccess, query?.data, dispatch]);

  return {
    ...query,
    refetch: query?.refetch,
  };
}

export function useTeamsTickets() {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["teamstickets"],
    queryFn: async () => {
      const data = await fetchTeamsTickets();
      return data;
    },
    onError: (err) => console.error("fetchMyTickets error:", err),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query?.isSuccess && query?.data?.length) {
      dispatch(setTeamsTickets(query?.data));
    }
  }, [query?.isSuccess, query?.data, dispatch]);

  return {
    ...query,
    refetch: query?.refetch,
  };
}

export function useTeamsOpenTickets() {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["teamsopentickets"],
    queryFn: async () => {
      const data = await fetchTeamsOpenTickets();
      return data;
    },
    onError: (err) => console.error("fetchMyTickets error:", err),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query?.isSuccess && query?.data?.length) {
      dispatch(setOpenTeamsTickets(query?.data));
    }
  }, [query?.isSuccess, query?.data, dispatch]);

  return {
    ...query,
    refetch: query?.refetch,
  };
}

export function useTeamsClosedTickets() {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["teamsclosedtickets"],
    queryFn: async () => {
      const data = await fetchTeamsClosedTickets();
      return data;
    },
    onError: (err) => console.error("fetchMyTickets error:", err),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query?.isSuccess && query?.data?.length) {
      dispatch(setClosedTeamsTickets(query?.data));
    }
  }, [query?.isSuccess, query?.data, dispatch]);

  return {
    ...query,
    refetch: query?.refetch,
  };
}

export function useTeamsResolvedTickets() {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["teamsresolvedtickets"],
    queryFn: async () => {
      const data = await fetchTeamsResolvedTickets();
      return data;
    },
    onError: (err) => console.error("fetchMyTickets error:", err),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query?.isSuccess && query?.data?.length) {
      dispatch(setResolvedTeamsTickets(query?.data));
    }
  }, [query?.isSuccess, query?.data, dispatch]);

  return {
    ...query,
    refetch: query?.refetch,
  };
}

export function useUnassignedTickets() {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["unassignedtickets"],
    queryFn: async () => {
      const data = await fetchUnassignedTickets();
      return data;
    },
    onError: (err) => console.error("fetchMyTickets error:", err),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query?.isSuccess && query?.data?.length) {
      dispatch(setUnAssignedTickets(query?.data));
    }
  }, [query?.isSuccess, query?.data, dispatch]);

  return {
    ...query,
    refetch: query?.refetch,
  };
}

export function useMyRequestsTickets() {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["myrequeststickets"],
    queryFn: async () => {
      const data = await fetchMyRequestsTickets();
      return data;
    },
    onError: (err) => console.error("fetchMyTickets error:", err),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query?.isSuccess && query?.data?.length) {
      dispatch(setMyRequests(query?.data));
    }
  }, [query?.isSuccess, query?.data, dispatch]);

  return {
    ...query,
    refetch: query?.refetch,
  };
}

export function useMyOpenRequestsTickets() {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["myopenrequeststickets"],
    queryFn: async () => {
      const data = await fetchMyOpenRequestsTickets();
      return data;
    },
    onError: (err) => console.error("fetchMyTickets error:", err),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query?.isSuccess && query?.data?.length) {
      dispatch(setMyOpenRequests(query?.data));
    }
  }, [query?.isSuccess, query?.data, dispatch]);

  return {
    ...query,
    refetch: query?.refetch,
  };
}

export function useMyClosedRequestsTickets() {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["myclosedrequeststickets"],
    queryFn: async () => {
      const data = await fetchMyClosedRequestsTickets();
      return data;
    },
    onError: (err) => console.error("fetchMyTickets error:", err),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query?.isSuccess && query?.data?.length) {
      dispatch(setMyClosedRequests(query?.data));
    }
  }, [query?.isSuccess, query?.data, dispatch]);

  return {
    ...query,
    refetch: query?.refetch,
  };
}

export function useMyResolvedRequestsTickets() {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["myresolvedrequeststickets"],
    queryFn: async () => {
      const data = await fetchMyResolvedRequestsTickets();
      return data;
    },
    onError: (err) => console.error("fetchMyTickets error:", err),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query?.isSuccess && query?.data?.length) {
      dispatch(setMyResolvedRequests(query?.data));
    }
  }, [query?.isSuccess, query?.data, dispatch]);

  return {
    ...query,
    refetch: query?.refetch,
  };
}

export function useMyApprovalsTickets() {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["myapprovalstickets"],
    queryFn: async () => {
      const data = await fetchMyApprovalTickets();
      return data;
    },
    onError: (err) => console.error("fetchMyTickets error:", err),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query?.isSuccess && query?.data?.length) {
      dispatch(setApprovals(query?.data));
    }
  }, [query?.isSuccess, query?.data, dispatch]);

  return {
    ...query,
    refetch: query?.refetch,
  };
}

export function useMyPendingApprovalsTickets() {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["mypendingapprovalstickets"],
    queryFn: async () => {
      const data = await fetchMyPendingApprovalTickets();
      return data;
    },
    onError: (err) => console.error("fetchMyTickets error:", err),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query?.isSuccess && query?.data?.length) {
      dispatch(setPendingApprovals(query?.data));
    }
  }, [query?.isSuccess, query?.data, dispatch]);

  return {
    ...query,
    refetch: query?.refetch,
  };
}

export function useMyApprovedApprovalsTickets() {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["myapprovedapprovalstickets"],
    queryFn: async () => {
      const data = await fetchMyApprovedApprovalTickets();
      return data;
    },
    onError: (err) => console.error("fetchMyTickets error:", err),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query?.isSuccess && query?.data?.length) {
      dispatch(setApprovedApprovals(query?.data));
    }
  }, [query?.isSuccess, query?.data, dispatch]);

  return {
    ...query,
    refetch: query?.refetch,
  };
}

export function useMyRejectedApprovalsTickets() {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["myrejectedapprovalstickets"],
    queryFn: async () => {
      const data = await fetchMyRejectedApprovalTickets();
      return data;
    },
    onError: (err) => console.error("fetchMyTickets error:", err),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query?.isSuccess && query?.data?.length) {
      dispatch(setRejectedApprovals(query?.data));
    }
  }, [query?.isSuccess, query?.data, dispatch]);

  return {
    ...query,
    refetch: query?.refetch,
  };
}

export function useMyCancelledApprovalsTickets() {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["mycancelledapprovalstickets"],
    queryFn: async () => {
      const data = await fetchMyCancelledApprovalTickets();
      return data;
    },
    onError: (err) => console.error("fetchMyTickets error:", err),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query?.isSuccess && query?.data?.length) {
      dispatch(setCancelledApprovals(query?.data));
    }
  }, [query?.isSuccess, query?.data, dispatch]);

  return {
    ...query,
    refetch: query?.refetch,
  };
}
