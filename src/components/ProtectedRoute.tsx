// src/components/ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

// { children }은 ProtectedRoute 컴포넌트 내부에 감싸진 내용물 (Admin 컴포넌트)를 의미
export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true); // 검사 중인지 확인

  useEffect(() => {
    // 1. 현재 로그인된 상태인지 확인 (세션 검사)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);

      // 2. 로그인 안 했으면? -> 로그인 페이지로 이동
      if (!session) {
        alert("관리자만 접근할 수 있습니다! ✋");
        navigate("/login", { replace: true });
      }
    });

    // 3. (옵션) 로그인 상태가 바뀌는지 계속 감시
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) navigate("/login", { replace: true });
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // 4. 검사 중일 때는 아무것도 보여주지 않음 (깜빡임 방지)
  if (loading)
    return <div className="text-center py-20">인증 확인 중... 🕵️‍♂️</div>;

  // 5. 로그인 확인되면? -> 내용물(Admin) 보여줌!
  return session ? <>{children}</> : null;
}
