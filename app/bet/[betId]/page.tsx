"use client";

export default function ViewBet({ params }: { params: { betId: number } }) {
  return <div>{params.betId}</div>;
}
