import { apiRequest } from "./client";

export interface CheckoutResponse {
  status: "FREE" | "PENDING";
  orderId?: number;
  orderCode?: number;
  amount?: number;
  checkoutUrl?: string;
  currency?: string;
  message?: string;
  courseId?: number;
}

export interface Order {
  id: number;
  userId: number;
  courseId: number;
  orderCode: number;
  amount: number;
  currency: string;
  status: string;
  checkoutUrl?: string;
  paidAt?: string;
  createdAt: string;
}

export function checkout(courseId: number) {
  return apiRequest<CheckoutResponse>(`/api/v1/payment/checkout/${courseId}`, {
    method: "POST",
  });
}

export function getMyOrders() {
  return apiRequest<Order[]>("/api/v1/payment/orders");
}
