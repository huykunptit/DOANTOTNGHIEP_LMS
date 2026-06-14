"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck, Loader2, X } from "lucide-react";
import { useState } from "react";
import { getMyNotifications, getUnreadNotificationCount, markNotificationRead } from "@/lib/api";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();

  const { data: count = 0 } = useQuery({
    queryKey: ["notif-count"],
    queryFn: getUnreadNotificationCount,
    refetchInterval: 30_000,
  });

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: getMyNotifications,
    enabled: open,
  });

  const readMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["notif-count"] });
    },
  });

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Thông báo"
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#B3CCBC] bg-white text-[#6C8572] transition hover:bg-[#EEF7F2] hover:text-[#166534]"
      >
        <Bell className="h-4 w-4" />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#166534] text-[10px] font-bold text-white">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 z-40 w-80 overflow-hidden rounded-2xl border border-[#B3CCBC] bg-white shadow-[0_4px_24px_rgba(13,92,49,0.12)]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#B3CCBC] bg-[#EEF7F2] px-4 py-3">
              <h3 className="text-sm font-semibold text-[#0A1F12]">
                Thông báo
                {count > 0 && (
                  <span className="ml-2 rounded-full bg-[#166534] px-2 py-0.5 text-[10px] font-bold text-white">
                    {count}
                  </span>
                )}
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-[#6C8572] transition hover:bg-[#D5EADE] hover:text-[#0A1F12]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-[#166534]" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <Bell className="h-8 w-8 text-[#B3CCBC]" />
                  <p className="mt-2 text-sm text-[#6C8572]">Không có thông báo</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => { if (!n.readAt) readMutation.mutate(n.id); }}
                    className={`flex w-full items-start gap-3 border-b border-[#B3CCBC] px-4 py-3 text-left transition hover:bg-[#EEF7F2] ${
                      n.readAt ? "opacity-60" : ""
                    }`}
                  >
                    {/* Unread dot */}
                    <div className="mt-1 flex h-2 w-2 shrink-0 items-center justify-center">
                      {!n.readAt && (
                        <span className="h-2 w-2 rounded-full bg-[#166534]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[#0A1F12] line-clamp-1">{n.title}</p>
                      <p className="mt-0.5 text-xs text-[#6C8572] line-clamp-2">{n.message}</p>
                      <p className="mt-1 text-xs text-[#B3CCBC]">
                        {new Date(n.createdAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                    {n.readAt && <CheckCheck className="mt-1 h-3.5 w-3.5 shrink-0 text-[#B3CCBC]" />}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
