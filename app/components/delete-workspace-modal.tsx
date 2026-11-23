import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { Trash2 } from "lucide-react";

export function DeleteWorkspaceModal({
  workspaceId,
  workspaceName,
}: {
  workspaceId: string;
  workspaceName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const fetcher = useFetcher();
  const isDeleting = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.error === null) {
      setIsOpen(false);
    }
  }, [fetcher.data, fetcher.state]);

  return (
    <>
      <button
        className="button danger small delete-icon-button"
        type="button"
        aria-label={`Delete ${workspaceName}`}
        title={`Delete ${workspaceName}`}
        onClick={(event) => { event.stopPropagation(); setIsOpen(true); }}
        disabled={isDeleting}
      >
        <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
      </button>

      {isOpen ? (
        <div className="modal-backdrop" role="presentation">
          <section
            className="modal card"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`delete-workspace-title-${workspaceId}`}
          >
            <p className="eyebrow">Delete workspace</p>
            <h2 id={`delete-workspace-title-${workspaceId}`}>
              Delete “{workspaceName}”?
            </h2>
            <p className="muted">
              This will permanently delete the workspace and its data. This
              action cannot be undone.
            </p>
            <fetcher.Form method="post" action="/workspaces" className="modal-actions">
              <input type="hidden" name="intent" value="delete-workspace" />
              <input type="hidden" name="workspaceId" value={workspaceId} />
              <button
                className="button secondary"
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button className="button danger" type="submit" disabled={isDeleting}>
                {isDeleting ? "Deleting…" : "Delete workspace"}
              </button>
            </fetcher.Form>
          </section>
        </div>
      ) : null}
    </>
  );
}
