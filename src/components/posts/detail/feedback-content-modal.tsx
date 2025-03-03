import FormSend from '@/components/contact/form-send';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

export interface IFeebackContentModalProps {
    data: IPost;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function FeedbackContentModal({ data, open, setOpen }: IFeebackContentModalProps) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogTitle>
                    <div className="flex flex-col gap-2 text-center">
                        <span className="font-normal">Báo cáo chỉnh sữa nội dung </span>
                        <span>{data.title}</span>
                    </div>
                </DialogTitle>

                <FormSend onSended={() => setOpen(false)} prefixMessage={`Post ID: ${data.id} - ${data.title}: `} />
            </DialogContent>
        </Dialog>
    );
}
