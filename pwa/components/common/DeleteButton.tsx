import { FunctionComponent, ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useRouter } from "next/router";
import {fetch, FetchError, FetchResponse} from "../../utils/dataAccess";
import { Item } from "../../types/item";
import { useMutation } from "react-query";
import { intlFormatted } from "./intlDefined";
import { useMessageService } from "../../services/MessageService";
import {Employee} from "../../types/Employee";

interface Props {
  type: string;
  item?: Item;
  redirect: string;
  parentTopic: string; // topic of FlashMessage to show errors and deleting message
  deletedMessage?: intlFormatted;
}

interface DeleteParams {
  id: string;
}

const deleteItem = async (id: string) =>
  await fetch<Item>(id, { method: "DELETE" });

/** FunctionComponent
 * Meant to be used with FlashMessage with topic=type to show deleted message
 * and one with topic=parentTopic to show loading and error message
 * @param props
*/
const DeleteButton: FunctionComponent<Props> = ({ type, item, redirect, parentTopic, deletedMessage}) => {
  const intl = useIntl();
  const router = useRouter();
  const messageService = useMessageService();

  const successMessage = deletedMessage ? deletedMessage :
    intl.formatMessage(
      { id: type + ".deleted", defaultMessage: "Item deleted" },
      { label: (item && item["label"]) ?? ""}
    );

  const deleteMutation = useMutation<
    FetchResponse<Employee> | undefined,
    Error | FetchError,
    DeleteParams
    >(({ id}) => deleteItem(id), {
    onSuccess: () => {
      messageService.success(type, successMessage);
      router.push(redirect);
    },
    onError: (error) => {
      messageService.danger(
        parentTopic,
        intl.formatMessage(
          {
            id: type + ".delete.error",
            defaultMessage: "Error when deleting the item: {error}.",
          },
          { error: error.message }
        )
      );
      console.error(error);
    },
  });

  const handleDelete = () => {
    const itemId = item && item["@id"];
    if (!item || !itemId) return;
    if (
      !window.confirm(
        intl.formatMessage({
          id: type + ".delete.confirm",
          defaultMessage: "Are you sure you want to delete this item?",
        })
      )
    )
      return;

    messageService.info(parentTopic, intl.formatMessage(
        { id: type + ".deleting", defaultMessage: "Deleting {label}" },
        { label: item["label"] }
      )
    );

    deleteMutation.mutate({ id: itemId });
  };


  return (
    <button
      className="inline-block mt-2 border-2 border-red-400 hover:border-red-700 hover:text-red-700 text-sm text-red-400 font-bold py-2 px-4 rounded"
      onClick={handleDelete}
      disabled={!item}
    >
      <FormattedMessage id="delete" defaultMessage="Delete" />
    </button>
  );
}

export default DeleteButton;

