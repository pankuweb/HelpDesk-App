import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchHR365AMXAssets, fetchHR365HDMDepartments, fetchHR365HDMPriority, fetchHR365HDMRequestType, fetchHR365HDMServices, fetchHR365HDMSettings, fetchHR365HDMSubServices, fetchHR365HDMSubServicesLevelWise, fetchUsers, searchGraphUsers } from "../backend/RequestAPI";
import { setDepartments, setPriority, setRequestTypes, setServices, setSettings, setSubServices, setSubServicesLevelWise } from "../redux/slices/requestSlice";
import { setGraphUsersData, updateUsersData } from "../redux/slices/userSlice";

export function useServices() {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["fetchHR365HDMServices"],
    queryFn: async () => {
      const data = await fetchHR365HDMServices();
      return data;
    },
    onError: (err) => console.error("fetchHR365HDMServices error:", err),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query?.isSuccess && query?.data?.length) {
      dispatch(setServices(query?.data));
    }
  }, [query?.isSuccess, query?.data, dispatch]);

  return {
    ...query,
    refetch: query?.refetch,
  };
}

export function useSubServices() {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["fetchHR365HDMSubServices"],
    queryFn: async () => {
      const data = await fetchHR365HDMSubServices();
      return data;
    },
    onError: (err) => console.error("fetchHR365HDMSubServices error:", err),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query?.isSuccess && query?.data?.length) {
      dispatch(setSubServices(query?.data));
    }
  }, [query?.isSuccess, query?.data, dispatch]);

  return {
    ...query,
    refetch: query?.refetch,
  };
}

export function useSubServicesLevelWise() {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["fetchHR365HDMSubServicesLevelWise"],
    queryFn: async () => {
      const data = await fetchHR365HDMSubServicesLevelWise();
      return data;
    },
    onError: (err) => console.error("fetchHR365HDMSubServicesLevelWise error:", err),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query?.isSuccess && query?.data?.length) {
      dispatch(setSubServicesLevelWise(query?.data));
    }
  }, [query?.isSuccess, query?.data, dispatch]);

  return {
    ...query,
    refetch: query?.refetch,
  };
}

export function usePriority() {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["fetchHR365HDMPriority"],
    queryFn: async () => {
      const data = await fetchHR365HDMPriority();
      return data;
    },
    onError: (err) => console.error("fetchHR365HDMPriority error:", err),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query?.isSuccess && query?.data?.length) {
      dispatch(setPriority(query?.data));
    }
  }, [query?.isSuccess, query?.data, dispatch]);

  return {
    ...query,
    refetch: query?.refetch,
  };
}

export function useRequestTypes() {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["fetchHR365HDMRequestType"],
    queryFn: async () => {
      const data = await fetchHR365HDMRequestType();
      return data;
    },
    onError: (err) => console.error("fetchHR365HDMRequestType error:", err),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query?.isSuccess && query?.data?.length) {
      dispatch(setRequestTypes(query?.data));
    }
  }, [query?.isSuccess, query?.data, dispatch]);

  return {
    ...query,
    refetch: query?.refetch,
  };
}

export function useDepartments() {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["fetchHR365HDMDepartments"],
    queryFn: async () => {
      const data = await fetchHR365HDMDepartments();
      return data;
    },
    onError: (err) => console.error("fetchHR365HDMDepartments error:", err),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query?.isSuccess && query?.data?.length) {
      dispatch(setDepartments(query?.data));
    }
  }, [query?.isSuccess, query?.data, dispatch]);

  return {
    ...query,
    refetch: query?.refetch,
  };
}

export function useAMXAssets() {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["fetchHR365AMXAssets"],
    queryFn: async () => {
      const data = await fetchHR365AMXAssets();
      return data;
    },
    onError: (err) => console.error("fetchHR365AMXAssets error:", err),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query?.isSuccess && query?.data?.length) {
      dispatch(setPriority(query?.data));
    }
  }, [query?.isSuccess, query?.data, dispatch]);

  return {
    ...query,
    refetch: query?.refetch,
  };
}

export function useFetchUsers() {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["useFetchUsers"],
    queryFn: async () => {
      const data = await fetchUsers();
      return data;
    },
    onError: (err) => console.error("useFetchUsers error:", err),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query?.isSuccess && query?.data?.length) {
      dispatch(updateUsersData(query?.data));
    }
  }, [query?.isSuccess, query?.data, dispatch]);

  return {
    ...query,
    refetch: query?.refetch,
  };
}

export function useFetchSettings() {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["useFetchSettings"],
    queryFn: async () => {
      const data = await fetchHR365HDMSettings();
      return data;
    },
    onError: (err) => console.error("useFetchSettings error:", err),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query?.isSuccess && query?.data?.length) {
      dispatch(setSettings(query?.data));
    }
  }, [query?.isSuccess, query?.data, dispatch]);

  return {
    ...query,
    refetch: query?.refetch,
  };
}

export function useFetchGraphUsers() {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["useFetchGraphUsers"],
    queryFn: async () => {
      const data = await searchGraphUsers();
      return data;
    },
    onError: (err) => console.error("useFetchGraphUsers error:", err),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query?.isSuccess && query?.data?.length) {
      dispatch(setGraphUsersData(query?.data));
    }
  }, [query?.isSuccess, query?.data, dispatch]);

  return {
    ...query,
    refetch: query?.refetch,
  };
}