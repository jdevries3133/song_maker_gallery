import React from "react";
import styled, { Button as DefaultButton } from "Styles";

const Button = styled(DefaultButton)`
  margin: 10px;
`;

const Nav = styled.nav`
  text-align: center;
  padding-top: 4rem;
`;

const navBar = ({ data }) => {
  const colors = [
    "#94c732", // green
    "#ffe716", // yellow
    "#2be2f9", // blue
    "#c77dd3", // purple
  ];
  return (
    <Nav id="gallery_top">
      {data.song_groups.map((group, i) => {
        return (
          <a
            className="a_nav"
            key={i + group.group_name}
            href={"#" + group.group_name}
          >
            <Button color={colors[i % colors.length]}>
              {group.group_name}
            </Button>
          </a>
        );
      })}
    </Nav>
  );
};

export default navBar;
