import { ProfectionPanel } from "./ProfectionPanel";
import { getZodiacSign } from "@/lib/numerology";

interface TimingAdvisorProps {
  dob: Date;
}

export function TimingAdvisor({ dob }: TimingAdvisorProps) {
  return (
    <div className="space-y-8">
      <ProfectionPanel birthDate={dob} ascendantSign={getZodiacSign(dob).name} />
    </div>
  );
}

