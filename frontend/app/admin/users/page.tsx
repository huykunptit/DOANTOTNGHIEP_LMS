"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ShieldCheck, Users } from "lucide-react";
import { getAdminUsers } from "@/lib/api";

export default function AdminUsersPage() {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: getAdminUsers,
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-blue-200/80">User management</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">Manage platform access</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">Track users, roles, and access status across the LMS.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-400">
            Add user <ArrowRight className="h-4 w-4" />
          </button>
        </header>

        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          {[
            ["Total users", "8,420"],
            ["Active roles", "6"],
            ["Suspended accounts", "14"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-sm">{label}</span>
                <ShieldCheck className="h-5 w-5 text-blue-200" />
              </div>
              <div className="mt-3 text-3xl font-semibold">{value}</div>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3 text-blue-200">
            <Users className="h-5 w-5" />
            <h2 className="text-lg font-semibold text-white">Users table</h2>
          </div>
          <div className="mt-5 overflow-hidden rounded-3xl border border-white/10">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-950/40 text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Last active</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr><td className="px-4 py-4 text-slate-400" colSpan={5}>Loading users...</td></tr>
                )}
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-white/10 bg-slate-950/30">
                    <td className="px-4 py-4 font-medium">{user.name}</td>
                    <td className="px-4 py-4 text-slate-300">{user.email}</td>
                    <td className="px-4 py-4 text-slate-300">{user.role}</td>
                    <td className="px-4 py-4 text-slate-300">{user.status}</td>
                    <td className="px-4 py-4 text-slate-300">{user.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
