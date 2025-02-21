import { AuthUser } from "models/user";
import { useMemo } from "react";
import { useSelector } from "react-redux";

const useAuthUser = () => {
  const user = useSelector(({ auth }) => auth.user);
  const authUser = useMemo(() => new AuthUser(user), [JSON.stringify(user)]);

  return authUser;
};

export default useAuthUser;
