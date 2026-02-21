import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Card, CardBody, Badge, Button, Spinner, Alert } from 'reactstrap';
import { fetchPatientAppointments } from '../../redux/appointmentSlice';

const STATUS_COLOR = {
  confirmed: 'success',
  cancelled: 'secondary',
};

function StatCard({ value, label, icon, color }) {
  return (
    <Card className="stat-card h-100">
      <CardBody className="d-flex align-items-center gap-3">
        <div className={`stat-icon bg-${color}-subtle text-${color}`}>{icon}</div>
        <div>
          <div className="stat-value">{value}</div>
          <div className="stat-label text-muted">{label}</div>
        </div>
      </CardBody>
    </Card>
  );
}

function ClientDashboardPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { list: appointments, loading, error } = useSelector((state) => state.appointments);

  useEffect(() => {
    dispatch(fetchPatientAppointments());
  }, [dispatch]);

  const upcoming = appointments.filter((a) => a.status !== 'cancelled' && new Date(`${a.date}T${a.startTime}`) >= new Date());
  const total = appointments.length;
  const cancelled = appointments.filter((a) => a.status === 'cancelled').length;

  return (
    <div>
      <div className="page-header mb-4">
        <h2 className="page-title">Welcome back, <span className="text-primary">{user?.name}</span></h2>
        <p className="text-muted">Here's an overview of your appointments</p>
      </div>

      {loading && (
        <div className="text-center py-5">
          <Spinner color="primary" />
        </div>
      )}
      {error && <Alert color="danger">{error}</Alert>}

      {!loading && (
        <>
          <Row className="g-4 mb-5">
            <Col xs={12} md={4}>
              <StatCard value={total} label="Total Appointments" icon="📅" color="primary" />
            </Col>
            <Col xs={12} md={4}>
              <StatCard value={upcoming.length} label="Upcoming" icon="🕐" color="success" />
            </Col>
            <Col xs={12} md={4}>
              <StatCard value={cancelled} label="Cancelled" icon="✕" color="danger" />
            </Col>
          </Row>

          <div className="section-header d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0 fw-semibold">Upcoming Appointments</h5>
            <Button tag={Link} to="/client/book" color="primary" size="sm" className="btn-primary-custom">
              + Book New
            </Button>
          </div>

          {upcoming.length === 0 ? (
            <Card className="empty-state-card">
              <CardBody className="text-center py-5">
                <div className="empty-icon mb-3">📋</div>
                <h6 className="text-muted">No upcoming appointments</h6>
                <Button tag={Link} to="/client/book" color="primary" className="btn-primary-custom mt-3">
                  Book your first appointment
                </Button>
              </CardBody>
            </Card>
          ) : (
            <Row className="g-3">
              {upcoming.slice(0, 3).map((appt) => (
                <Col key={appt._id} xs={12} md={6} lg={4}>
                  <Card className="appt-card h-100">
                    <CardBody>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-semibold mb-0">
                          Dr. {appt.doctorId?.name || 'Doctor'}
                        </h6>
                        <Badge color={STATUS_COLOR[appt.status] || 'secondary'} className="status-badge">
                          {appt.status}
                        </Badge>
                      </div>
                      {appt.doctorId?.specialty && (
                        <p className="text-muted small mb-2">{appt.doctorId.specialty}</p>
                      )}
                      <div className="appt-detail">
                        <span>📅</span>
                        <span>{new Date(appt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      </div>
                      <div className="appt-detail">
                        <span>🕐</span>
                        <span>{appt.startTime} – {appt.endTime}</span>
                      </div>
                      <div className="appt-detail">
                        <span>⏱</span>
                        <span>{appt.duration} min</span>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {upcoming.length > 3 && (
            <div className="text-center mt-3">
              <Button tag={Link} to="/client/appointments" color="link" className="text-primary">
                View all appointments →
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ClientDashboardPage;
