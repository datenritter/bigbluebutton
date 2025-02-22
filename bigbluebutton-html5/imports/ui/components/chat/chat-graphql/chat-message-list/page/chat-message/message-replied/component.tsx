import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import Styled, { DeleteMessage } from './styles';
import Storage from '/imports/ui/services/storage/in-memory';
import { ChatEvents } from '/imports/ui/core/enums/chat';

const intlMessages = defineMessages({
  deleteMessage: {
    id: 'app.chat.deleteMessage',
    description: '',
  },
});

interface MessageRepliedProps {
  message: string;
  sequence: number;
  emphasizedMessage: boolean;
  deletedByUser: string | null;
}

const ChatMessageReplied: React.FC<MessageRepliedProps> = (props) => {
  const {
    message, sequence, emphasizedMessage, deletedByUser,
  } = props;

  const intl = useIntl();
  const messageChunks = message.split('\n');

  return (
    <Styled.Container
      onClick={(e) => {
        e.preventDefault();
        window.dispatchEvent(
          new CustomEvent(ChatEvents.CHAT_FOCUS_MESSAGE_REQUEST, {
            detail: {
              sequence,
            },
          }),
        );
        Storage.removeItem(ChatEvents.CHAT_FOCUS_MESSAGE_REQUEST);
        Storage.setItem(ChatEvents.CHAT_FOCUS_MESSAGE_REQUEST, sequence);
      }}
    >
      {!deletedByUser && (
        <Styled.Message>
          <Styled.Markdown $emphasizedMessage={emphasizedMessage}>
            {messageChunks[0]}
          </Styled.Markdown>
        </Styled.Message>
      )}
      {deletedByUser && (
        <DeleteMessage>
          {intl.formatMessage(intlMessages.deleteMessage, { 0: deletedByUser })}
        </DeleteMessage>
      )}
    </Styled.Container>
  );
};

export default ChatMessageReplied;
