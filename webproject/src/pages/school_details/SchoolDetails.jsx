import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import Superside from "../admin_components/Superside.jsx";
import {
  addClasses,
  fetchClassesData,
  fetchSchoolData,
} from "../../utils/apiService.js";

import Loader from "../Loader.jsx";

const SchoolDetails = () => {
  const { schoolId } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    grade: "",
    section: "",
  });

  useEffect(() => {
    fetchSchoolDetails();
    fetchClasses();
  }, [schoolId]);

  const fetchSchoolDetails = async () => {
    try {
      const schooldData = await fetchSchoolData(schoolId);
      setSchool(schooldData);
    } catch (error) {
      console.error("Error fetching school details:", error);
    }
  };

  const fetchClasses = async () => {
    try {
      const classesData = await fetchClassesData(schoolId);
      setClasses(classesData);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
    setLoading(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addClasses(schoolId, formData);
      setShowModal(false);
      setFormData({ grade: "", section: "" });
      fetchClasses(); // Fetch the updated list of classes
    } catch (error) {
      console.error("Error adding class:", error);
    }
  };

  if (loading) {
    return <Loader></Loader>;
  }

  return (
    <div className="spdash">
      <Superside />
      <div className="superMain schoolCont">
        <h2>{school.name}</h2>
        <div className="schooldetails">
          <p className="defaultStyle">
            <b>Город:</b> {school.city}
          </p>
          <p className="defaultStyle">
            <b>Email:</b> {school.email}
          </p>
          <p className="defaultStyle">
            <b>Количество учеников:</b> {school.student_number}
          </p>
        </div>

        <h3>Классы</h3>
        {classes.length === 0 ? (
          <div
            className="classList"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <p style={{ color: "lightgray" }}>Классы еще не добавлены :(</p>
          </div>
        ) : (
          <ul className="classList">
            {classes.map((classItem) => (
              <li
                key={classItem.id}
                onClick={() =>
                  navigate(`/schools/${schoolId}/classes/${classItem.id}`)
                }
                className="classItem"
              >
                Класс:{" "}
                <b>
                  {classItem.grade} {classItem.section}
                </b>
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={() => setShowModal(true)}
          style={{
            border: "none",
            borderRadius: "4px",
            backgroundColor: "#509CDB",
            fontSize: "large",
            fontWeight: "600",
          }}
        >
          Добавить класс
        </button>

        {showModal && (
          <dialog open className="modal supermodal">
            <div className="modal-content">
              <button
                style={{
                  border: "none",
                  float: "right",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                }}
                onClick={() => setShowModal(false)}
              >
                <CloseIcon sx={{ color: "gray" }} />
              </button>
              <br />
              <form
                onSubmit={handleSubmit}
                style={{ padding: "20px", fontSize: "large" }}
              >
                <label htmlFor="grade">Класс</label>
                <input
                  type="text"
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleFormChange}
                  required
                  style={{ width: "100%", padding: "10px", fontSize: "large" }}
                />
                <br />
                <br />
                <label htmlFor="section">Буква</label>
                <input
                  type="text"
                  id="section"
                  name="section"
                  value={formData.section}
                  onChange={handleFormChange}
                  required
                  style={{ width: "100%", padding: "10px", fontSize: "large" }}
                />
                <br />
                <br />
                <button type="submit" className="superBtn">
                  Добавить
                </button>
              </form>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
};

export default SchoolDetails;