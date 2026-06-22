export default function TaskModal({ task, onClose }) {
  if (!task) return null;

  return (
    <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>

      <div className="modal-dialog modal-md">

        <div className="modal-content p-3">

          {/* HEADER */}
          <div className="d-flex justify-content-between align-items-center border-bottom pb-2">

            <h5 className="mb-0">{task.title}</h5>

            <button className="btn-close" onClick={onClose}></button>

          </div>

          {/* BODY */}
          <div className="mt-3">

            <p className="text-muted">{task.description}</p>

            <p>
              <b>Status: </b>
              <span className={
                "badge " +
                (task.status === "Completed"
                  ? "bg-success"
                  : task.status === "Pending"
                  ? "bg-warning text-dark"
                  : "bg-primary")
              }>
                {task.status}
              </span>
            </p>

            <p><b>Start Date:</b> {task.startDate}</p>
            <p><b>End Date:</b> {task.endDate}</p>

          </div>

          {/* FOOTER */}
          <div className="d-flex justify-content-end gap-2 mt-3">

            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}