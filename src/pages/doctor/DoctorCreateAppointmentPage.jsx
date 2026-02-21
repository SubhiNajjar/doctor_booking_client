import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  Spinner,
  Row,
  Col,
  Table,
} from "reactstrap";
import api from "../../utils/api";

const emptySpecific = { date: "", startTime: "09:00", endTime: "17:00" };

function DoctorCreateAppointmentPage() {
  const [availability, setAvailability] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [specificForm, setSpecificForm] = useState(emptySpecific);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchAvailability = useCallback(async () => {
    setLoadingData(true);
    setError("");
    try {
      const res = await api.get("/doctor/availability");
      setAvailability(res.data.availability);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load availability");
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const flash = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 4000);
  };

  const addSpecific = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post("/doctor/availability/specific", {
        date: specificForm.date + "T12:00:00.000Z",
        startTime: specificForm.startTime,
        endTime: specificForm.endTime,
        duration: 30,
      });
      await fetchAvailability();
      setSpecificForm(emptySpecific);
      flash("Specific slot added!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add slot");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteSpecific = async (slotId) => {
    setDeletingId(slotId);
    try {
      await api.delete(`/doctor/availability/specific/${slotId}`);
      await fetchAvailability();
      flash("Specific slot removed.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete slot");
    } finally {
      setDeletingId(null);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <div className="page-header mb-4">
        <h2 className="page-title">Manage Availability</h2>
        <p className="text-muted">
          Set when you're available for patient appointments
        </p>
      </div>

      {error && (
        <Alert color="danger" className="py-2">
          {error}
        </Alert>
      )}
      {success && (
        <Alert color="success" className="py-2">
          {success}
        </Alert>
      )}

      <Card className="shadow-sm">
        <CardBody className="p-4">
          <h6 className="fw-semibold mb-3">📅 Add a Specific Date Slot</h6>
          <Form onSubmit={addSpecific}>
            <Row className="g-3 align-items-end">
              <Col xs={12} md={4}>
                <FormGroup className="mb-0">
                  <Label className="form-label-custom">Date</Label>
                  <Input
                    type="date"
                    value={specificForm.date}
                    min={today}
                    onChange={(e) =>
                      setSpecificForm({ ...specificForm, date: e.target.value })
                    }
                    className="form-input-custom"
                    required
                  />
                </FormGroup>
              </Col>
              <Col xs={6} md={3}>
                <FormGroup className="mb-0">
                  <Label className="form-label-custom">Start</Label>
                  <Input
                    type="time"
                    value={specificForm.startTime}
                    onChange={(e) =>
                      setSpecificForm({
                        ...specificForm,
                        startTime: e.target.value,
                      })
                    }
                    className="form-input-custom"
                  />
                </FormGroup>
              </Col>
              <Col xs={6} md={3}>
                <FormGroup className="mb-0">
                  <Label className="form-label-custom">End</Label>
                  <Input
                    type="time"
                    value={specificForm.endTime}
                    onChange={(e) =>
                      setSpecificForm({
                        ...specificForm,
                        endTime: e.target.value,
                      })
                    }
                    className="form-input-custom"
                  />
                </FormGroup>
              </Col>
              <Col xs={12} md={2} className="availability-add-col">
                <Button
                  type="submit"
                  color="primary"
                  disabled={submitting}
                  className="btn-primary-custom w-100 availability-add-btn"
                >
                  {submitting ? <Spinner size="sm" className="me-1" /> : "+ "}
                  Add
                </Button>
              </Col>
            </Row>
          </Form>

          <hr className="my-4" />
          <h6 className="fw-semibold mb-3">Your Specific Date Slots</h6>

          {loadingData ? (
            <div className="text-center py-3">
              <Spinner color="primary" />
            </div>
          ) : !availability?.specificSlots?.length ? (
            <p className="text-muted">No specific date slots added yet.</p>
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0 custom-table">
                <thead>
                  <tr>
                    <th className="date-col">Date</th>
                    <th className="time-col">Start</th>
                    <th className="time-col">End</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {availability.specificSlots.map((slot) => (
                    <tr key={slot._id}>
                      <td className="date-col">
                        {new Date(slot.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          timeZone: "UTC",
                        })}
                      </td>
                      <td className="time-col">{slot.startTime}</td>
                      <td className="time-col">{slot.endTime}</td>
                      <td>
                        <Button
                          size="sm"
                          color="danger"
                          outline
                          disabled={deletingId === slot._id}
                          onClick={() => deleteSpecific(slot._id)}
                          className="btn-danger-outline"
                        >
                          {deletingId === slot._id ? (
                            <Spinner size="sm" />
                          ) : (
                            "Remove"
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default DoctorCreateAppointmentPage;
