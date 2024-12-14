import { ActionPanel, Action, Icon, List } from "@raycast/api";
import { useState } from "react";

export default function Command() {
  const [chat, setChat] = useState<string[]>([]);
  const [isLoading, setIsLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false);
  const [query, setQuery]: [string, React.Dispatch<React.SetStateAction<string>>] = useState("");
  return (
    <List
      isShowingDetail={chat && chat.length > 0}
      searchText={query}
      onSearchTextChange={(t) => {
        if (!isLoading) setQuery(t);
      }}
      searchBarPlaceholder="Ask..."
      actions={
        <ActionPanel>
          <Action
            title="Get Answer"
            icon={Icon.SpeechBubbleActive}
            onAction={() => {
              setChat([...chat, "hey"]);
            }}
          />
        </ActionPanel>
      }
    >
      {chat && chat.length > 0 ? (
        chat.map((item, i) => (
          <List.Item
            key={i}
            id={i.toString()}
            title={item}
            detail={<List.Item.Detail markdown={`${item}`} />}
            actions={
              <ActionPanel>
                <Action
                  title="Get Answer"
                  icon={Icon.SpeechBubbleActive}
                  onAction={() => {
                    setChat([...chat, "hey"]);
                  }}
                />
                <Action.CopyToClipboard content={item} />
              </ActionPanel>
            }
          />
        ))
      ) : (
        <List.EmptyView icon={Icon.Message} title="Start a Conversation" />
      )}
    </List>
  );
}
