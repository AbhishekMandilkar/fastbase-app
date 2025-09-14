import {db} from "../lib/db";


export async function WaitlistCount() {
  const count = await db.waitlist.count();
  
  return (
    <p className="text-[#FF6B00]">
      {count} people already joined the waitlist
    </p>
  );
} 