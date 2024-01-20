import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import { Hash, Link, Share2 } from 'lucide-react'
import CopyToClipboard from 'react-copy-to-clipboard'

type InviteDropDownProps = {
  roomId: string | undefined
}

const InviteDropDown = ({ roomId }: InviteDropDownProps) => {
  const { toast } = useToast()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'secondary'}>
          <Share2 />
          Invite
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Invitation Type</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <CopyToClipboard
              text={`${location.href}`}
              onCopy={() =>
                toast({
                  description: 'Invite Link Copied!',
                })
              }
            >
              <p className="flex items-center w-full gap-1">
                <Link size={14} /> Link
              </p>
            </CopyToClipboard>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CopyToClipboard
              text={`${roomId?.slice(-6)}`}
              onCopy={() =>
                toast({
                  description: 'Join Code Copied!',
                })
              }
            >
              <p className="flex items-center w-full gap-1">
                <Hash size={14} /> Join Code
              </p>
            </CopyToClipboard>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export default InviteDropDown
