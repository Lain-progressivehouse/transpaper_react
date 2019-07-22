import React from 'react';
import {Container, Icon, Menu} from "semantic-ui-react";

const Header: React.FC = () => {
  return (
    <Menu fixed='top' inverted>
      <Container>
        <Menu.Item as='a' header>
          <Icon size='large' name="react" style={{marginRight: '0.1em'}}/>
          Transpaper.App
        </Menu.Item>
        <Menu.Item as='a'>Home</Menu.Item>
      </Container>
    </Menu>
  );
}

export default Header;