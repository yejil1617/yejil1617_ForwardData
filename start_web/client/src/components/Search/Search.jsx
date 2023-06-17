import React, { useState } from "react";
import {
  Button,
  InputGroup,
  ListGroup,
  Form,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import axios from "axios";
import "./Search.css";

function Search() {
  const MAX_LENGTH = 5; // maximum number of links or keywords displayed
  const [profiles, setProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // const [subscribed, setSubscribed] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSubscribe = async (profileId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:8000/api/profiles/${profileId}/favorite`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);

      // Toggle the favorited status of the profile in state
      setProfiles(
        profiles.map((profile) =>
          profile._id === profileId
            ? { ...profile, favorited: !profile.favorited }
            : profile
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    setSearchPerformed(true);
    try {
      const profilesResponse = await axios.get(
        `http://localhost:8000/api/profiles/search?q=${searchTerm}`
      );

      const token = localStorage.getItem("token");
      const favoritesResponse = await axios.get(
        "http://localhost:8000/api/profiles/favorited",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const favoritedProfileIds = new Set(
        favoritesResponse.data.data.map((id) => id.toString())
      );

      setProfiles(
        profilesResponse.data.data.map((profile) => ({
          ...profile,
          favorited: favoritedProfileIds.has(profile._id),
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Container
        className={
          searchPerformed
            ? "mt-5 search-container after-search"
            : "mt-5 search-container"
        }
      >
        <Row>
          <Col>
            <Form className="d-flex">
              <InputGroup.Text className="bg-white search-icon">
                <BsSearch />
              </InputGroup.Text>
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2 search-bar"
                style={{ width: "50vw" }}
                aria-label="Search"
                maxLength={80}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <Button type="submit" onClick={handleSearch}>
                Search
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>

      <ListGroup
        className={
          searchPerformed
            ? "align-items-center after-search"
            : "align-items-center"
        }
        style={{ borderRadius: "30%" }}
      >
        {profiles.map((profile, profile_index) => (
          <ListGroup.Item
            key={profile_index}
            className="rounded mb-4 search-listGroup-item"
          >
            <div className="d-flex justify-content-between">
              <div className="d-flex flex-column">
                <h5 className="mt-2" style={{ fontWeight: "bold" }}>
                  {profile.firstName && profile.lastName
                    ? profile.firstName +
                      " " +
                      profile.lastName +
                      ", " +
                      profile.institution
                    : profile.primaryName + ", " + profile.institution}
                  &nbsp;
                </h5>

                {/* <div className="d-flex">
                  <h6 className="mt-3" style={{ fontWeight: "bold" }}>
                    {profile.firstName + " " + profile.lastName + ","}&nbsp;
                  </h6>

                  <h6 className="mt-3" style={{ fontWeight: "bold" }}>
                    {profile.institution}
                  </h6>
                </div> */}

                <div className="d-flex">
                  <h6 className="text-warning">Links:&nbsp;</h6>

                  {/* display only first 5 links */}
                  {profile.links
                    .slice(0, MAX_LENGTH)
                    .map((link, link_index) => {
                      if (
                        link_index ===
                        Math.min(profile.links.length - 1, MAX_LENGTH - 1)
                      ) {
                        return <h6 key={link_index}>{link}</h6>;
                      } else {
                        return <h6 key={link_index}>{link + ","}&nbsp;</h6>;
                      }
                    })}
                  {profile.links.length > MAX_LENGTH && <h6>...</h6>}
                </div>

                <div className="d-flex">
                  <h6 className="text-warning">Keywords:&nbsp;</h6>

                  {/* display only first 5 keywords */}
                  {profile.keywords
                    .slice(0, MAX_LENGTH)
                    .map((keyword, keyword_index) => {
                      if (
                        keyword_index ===
                        Math.min(profile.keywords.length - 1, MAX_LENGTH - 1)
                      ) {
                        return <h6 key={keyword_index}>{keyword}</h6>;
                      } else {
                        return (
                          <h6 key={keyword_index}>{keyword + ","}&nbsp;</h6>
                        );
                      }
                    })}
                  {profile.keywords.length > MAX_LENGTH && <h6>...</h6>}
                </div>
              </div>

              {profile.favorited ? (
                <div className="align-self-center">
                  <AiFillStar
                    size={25}
                    color="orange"
                    onClick={() => handleSubscribe(profile._id)}
                  />
                </div>
              ) : (
                <div className="align-self-center">
                  <AiOutlineStar
                    size={25}
                    onClick={() => handleSubscribe(profile._id)}
                  />
                </div>
              )}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default Search;
