import {
  Button,
  DialogActionBar,
  DialogScaffold,
  DialogTopbar,
  useDialog,
} from '@hanlogy/react-web-ui';
import { FilledButton } from '@/components/buttons/FilledButton';

export function useOpenConfirm() {
  const { openDialog } = useDialog();

  return {
    openConfirm: async ({
      title,
      message,
      yesLabel = 'Confirm',
      noLabel = 'Cancel',
    }: {
      title?: string;
      message?: string;
      yesLabel?: string;
      noLabel?: string;
    } = {}): Promise<boolean> => {
      return (
        (await openDialog<boolean>(({ closeDialog }) => {
          return (
            <DialogScaffold
              className="w-md rounded-xl bg-white"
              bottomBar={
                <DialogActionBar>
                  <FilledButton
                    onClick={() => closeDialog(true)}
                    size="xsmall"
                    className="min-w-20"
                  >
                    {yesLabel}
                  </FilledButton>
                  <Button onClick={() => closeDialog(false)}>{noLabel}</Button>
                </DialogActionBar>
              }
              topbar={
                title && (
                  <DialogTopbar className="text-xl font-medium">
                    {title}
                  </DialogTopbar>
                )
              }
            >
              {message}
            </DialogScaffold>
          );
        })) || false
      );
    },
  };
}
