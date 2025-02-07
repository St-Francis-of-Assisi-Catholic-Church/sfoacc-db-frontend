import React, { useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";

import { IMember } from "../../../_components/member-columns";
import SendVerificationMessageModal from "./sendVerificationMessageModal";
import { BaseModalRef } from "@/components/ui/modal";
import UpdateMembershipStatusModal from "./updateMembershipStatusModal";
import GenerateChurchIDModal from "./generateChurchIDModal";
import UpdateVerificationStatusModal from "./updateVerificationStatusModal";

type Props = {
  member: IMember;
};

export default function AdminActions({ member }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const churchIDModalRef = useRef<BaseModalRef>(null);
  const verificationModalRef = useRef<BaseModalRef>(null);
  const membershipStatusModalRef = useRef<BaseModalRef>(null);
  const verificationStatusModalRef = useRef<BaseModalRef>(null);

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger className="flex flex-row justify-between items-center bg-primary text-primary-foreground shadow hover:bg-primary/90 h-[29px] rounded-md px-3 text-xs">
          Actions
          <ChevronDownIcon className="h-4 w-4 ml-2" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-2 w-52">
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => {
              setDropdownOpen(false);
              churchIDModalRef.current?.openModal();
            }}
          >
            Generate ChurchID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => {
              setDropdownOpen(false);
              verificationModalRef.current?.openModal();
            }}
          >
            Send Verification Message
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => {
              setDropdownOpen(false);
              membershipStatusModalRef.current?.openModal();
            }}
          >
            Update Membership Status
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => {
              setDropdownOpen(false);
              verificationStatusModalRef.current?.openModal();
            }}
          >
            Update Verification Status
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <GenerateChurchIDModal modalRef={churchIDModalRef} member={member} />

      <SendVerificationMessageModal
        modalRef={verificationModalRef}
        member={member}
      />

      <UpdateMembershipStatusModal
        modalRef={membershipStatusModalRef}
        member={member}
      />

      <UpdateVerificationStatusModal
        modalRef={verificationStatusModalRef}
        member={member}
      />
    </>
  );
}
