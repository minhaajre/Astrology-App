import { SpecialDatesInfo } from "./SpecialDatesInfo";

interface TimingAdvisorProps {
  dob: Date;
}

export function TimingAdvisor({ dob }: TimingAdvisorProps) {

  return <SpecialDatesInfo />;
}

