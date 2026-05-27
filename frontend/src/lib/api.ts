const BASE_URL = "http://localhost:3000/api/v1";

const token = () => localStorage.getItem("token") ?? "";

const authHeaders = (): Record<string, string> => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token()}`,
});

async function request<T>(url: string, options?: RequestInit): Promise<{ ok: boolean; data: T }> {
  const res = await fetch(url, options);
  const data: T = await res.json();
  return { ok: res.ok, data };
}

export function signup(body: { firstName: string; lastName: string; email: string; password: string }) {
  return request<{ token: string; message: string }>(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function signin(body: { email: string; password: string }) {
  return request<{ token: string; message: string }>(`${BASE_URL}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function getBalance() {
  return request<{ balance: number }>(`${BASE_URL}/account/balance`, {
    headers: authHeaders(),
  });
}

export function getUsers(filter: string) {
  return request<{ users: { _id: string; firstName: string; lastName: string }[] }>(
    `${BASE_URL}/user/bulk?filter=${encodeURIComponent(filter)}`,
    { headers: authHeaders() }
  );
}

export function transfer(to: string, amount: number) {
  return request<{ message: string }>(`${BASE_URL}/account/transfer`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ to, amount }),
  });
}
