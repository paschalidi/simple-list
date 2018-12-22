import "semantic-ui-css/semantic.min.css";
import React from "react";
import axios from "axios";
import { Input, Segment, Grid, Button } from "semantic-ui-react";
import Link from "next/link";

export default class Index extends React.Component {
  static async getInitialProps({ query }) {
    const res = await axios(
      "https://hacker-news.firebaseio.com/v0/topstories.json"
    );
    const ids = await res.data;

    const promises = ids.slice(1, 30 * (query.page || 1)).map(async id => {
      const response = await axios({
        method: "GET",
        url: `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      });

      return response.data;
    });

    const stories = await Promise.all(promises);
    return { stories };
  }

  state = { searchTerm: "", page: 2 };

  handleOnChange = event =>
    this.setState({ searchTerm: event.target.value.toLowerCase() });

  handleClick = () => this.setState({ page: this.state.page + 1 });

  render() {
    const { stories } = this.props;
    if (!stories) {
      return <div>loading</div>;
    }
    return (
      <Grid centered columns={2}>
        <Grid.Column>
          <Input
            size="huge"
            style={{ paddingTop: "6vh" }}
            fluid
            type="text"
            placeholder="Search here"
            onChange={this.handleOnChange}
          />

          {stories
            .filter(story =>
              story.title.toLowerCase().includes(this.state.searchTerm)
            )
            .map((story, key) => (
              <Segment color="pink" key={key}>
                <h4 style={{ marginBottom: 0 }}>{story.title}</h4>
                <div>by: {story.by}</div>
                <a target="_blank" rel="noopener noreferrer" href={story.url}>
                  {story.url}
                </a>
              </Segment>
            ))}

          <div style={{ marginTop: 20 }}>
            <Link href={`/?page=${this.state.page}`}>
              <Button onClick={this.handleClick} fluid>
                More
              </Button>
            </Link>
          </div>
        </Grid.Column>
      </Grid>
    );
  }
}
