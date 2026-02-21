import React from 'react';
import { useSelector } from 'react-redux';
import { Card, CardBody, Row, Col, Badge } from 'reactstrap';

function InfoRow({ label, value }) {
  return (
    <div className="settings-info-row">
      <span className="settings-label">{label}</span>
      <span className="settings-value">{value || '—'}</span>
    </div>
  );
}

function SettingsPage() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div>
      <div className="page-header mb-4">
        <h2 className="page-title">Account Settings</h2>
        <p className="text-muted">Your profile information</p>
      </div>

      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="settings-card shadow-sm">
            <CardBody className="p-4">
              {/* Avatar */}
              <div className="text-center mb-4">
                <div className="settings-avatar mx-auto">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <h4 className="fw-semibold mt-3 mb-1">{user?.name}</h4>
                <Badge
                  color={user?.role === 'doctor' ? 'primary' : 'success'}
                  pill
                  className="role-badge"
                >
                  {user?.role === 'doctor' ? '👨‍⚕️ Doctor' : '🧑 Patient'}
                </Badge>
              </div>

              <hr />

              <div className="mt-3">
                <InfoRow label="Full Name" value={user?.name} />
                <InfoRow label="Email Address" value={user?.email} />
                <InfoRow label="Role" value={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} />
                {user?.role === 'doctor' && (
                  <InfoRow label="Specialty" value={user?.specialty} />
                )}
                <InfoRow
                  label="Member Since"
                  value={
                    user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          month: 'long', day: 'numeric', year: 'numeric',
                        })
                      : '—'
                  }
                />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default SettingsPage;
