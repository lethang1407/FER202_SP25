import React from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "./Layout";

const HomePage = () => {
  return (
    <Container className="py-5">
      <Layout>
        <h1 className="text-4xl font-bold text-blue-600">Welcome to QuizApp!</h1>
      <Row>
          <Col className="text-center">
            <Card className="text-white shadow-lg p-3" style={{ backgroundColor: "#553f9a" }}>
              <Card.Body>
                <Card.Title className="fs-5">Quiz</Card.Title>
                <Link to={`/guest`} className="btn btn-primary btn-sm">
                  Bắt đầu
                </Link>
              </Card.Body>
            </Card>
          </Col>
      </Row>
      </Layout>
    </Container>
  );
};

export default HomePage;
