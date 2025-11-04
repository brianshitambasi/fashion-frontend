const StatCard = ({ title, value, icon }) => {
  return (
    <div className="card shadow-sm border-0">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h6 className="text-muted mb-1">{title}</h6>
          <h4 className="fw-bold mb-0">{value}</h4>
        </div>
        <div className="text-primary fs-4">{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;
