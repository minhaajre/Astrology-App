import { SpecialDatesInfo } from "./SpecialDatesInfo";
import { ProfectionPanel } from "./ProfectionPanel";

interface TimingAdvisorProps {
  dob: Date;
}

export function TimingAdvisor({ dob }: TimingAdvisorProps) {
  return (
    <div className="space-y-8">
      <SpecialDatesInfo />
      <ProfectionPanel birthDate={dob} />
    </div>
  );
}

