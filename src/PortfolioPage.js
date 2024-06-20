import React, { useState } from 'react';
import { Button, Dropdown, Container, Row, Col, Form } from 'react-bootstrap';
import './PortfolioPage.css';

const PortfolioPage = () => {
  const [showDropdown, setShowDropdown] = useState(null);
  const [reflectionText, setReflectionText] = useState('');
  const [documents, setDocuments] = useState({
    'Course Goal 1': ['What is Your Hope Discussion Board', 'What is Your Hope', 'Outline'],
    'Course Goal 2': ['Annotated Bibliography', 'Visual Analysis'],
    'Course Goal 3': ['Memoir Rough Draft', 'Visual Analysis'],
    'Course Goal 4': ['Peer Review', 'Visual Analysis'],
    'Course Goal 5': ['Memoir', 'Visual Analysis'],
  });

  const buttonClickHandler = (buttonName) => {
    setShowDropdown(buttonName);
    // Set the reflection text for the clicked button
    setReflectionText(reflections[buttonName]);
  };

  const closeDropdownHandler = () => {
    setShowDropdown(null);
  };

  const reflections = {
    'Course Goal 1': 'Through the “What is your hope” discussion board, I was able to collaborate with my peers to brainstorm ideas for our writing. This enabled me to create ideas and narrow them down to what we wanted to write about for the discussion post. For the “What is your hope one-pager,” I brainstormed ideas and decided on one to write about before writing a rough draft and revising and editing. I learned the importance of the outlining process through the creation of my outline for my memoir, as it helped me create a memoir with a more thought-through storyline.',
    'Course Goal 2': 'In my annotated bibliography, I learned how to compile information from college-level databases and learned how varied in scope information can be while researching. For example, some of the sources I found contained general information, and others contained very specific information on a single topic. In my visual analysis essay, I reinforced my knowledge of how to cite properly and wrote an essay with paragraphs that supported the thesis.',
    'Course Goal 3': 'While writing my rough draft for my memoir, I identified the purpose of entertaining and then chose my word choice based on my purpose and my intended audience. Throughout my memoir, I included descriptions. In my final draft 2 (visual analysis), I included a thesis (definitive statement) at the end of my introduction to make it clear what the rest of the essay would be about. This essay also included argumentation and cause and effect.',
    'Course Goal 4': 'While peer reviewing Mubashir’s essay, I learned how much easier it is for a peer to find mistakes in essays. For instance, I learned another writer’s way of formulating a story and noticed grammatical errors that I should watch out for in my own writing. Moreover, through the visual analysis essay, I learned how even the smallest details have a large impact on how an audience views a piece of writing or an image.',
    'Course Goal 5': 'Working on the two final drafts over multiple weeks allowed me to edit my word choice to better fit the essay and to make sure that I fixed grammatical errors. Moreover, through this process, I learned how many mistakes I usually make while writing and how I can greatly improve my writing by repeatedly going through the process of revising and editing.',
  };

  const word_count = {
    'What is Your Hope Discussion Board':159,
    'What is Your Hope':828,
    'Outline':104,
    'Annotated Bibliography':1176,
    'Visual Analysis':956,
    'Memoir Rough Draft':1205,
    'Peer Review':136,
    'Memoir':1744,
    };

  const reflectionChangeHandler = (e) => {
    // Update the reflection text for the currently displayed button
    reflections[showDropdown] = e.target.value;
    setReflectionText(e.target.value);
  };
  document.body.style.backgroundColor='blue';
  return (
    <div className='page'>
      <h1 className='text-center'>
        Portfolio
      </h1>
      <h2 className='text-center'>
        Arjun Rai 
      </h2>
      <h2 className='text-center'>
      ENGL-1301-24205
      </h2>
      <Container fluid className="text-center">
        <Row>
          <Col>
            {Object.keys(documents).map((buttonName) => (
              <Button
                key={buttonName}
                variant="dark" // Change the variant to "dark"
                size="xl"
                onClick={() => buttonClickHandler(buttonName)}
                style={{ width: '100%' }}
              >
                {buttonName}
              </Button>
            ))}
          </Col>
        </Row>
        {showDropdown && (
          <Dropdown
            show={showDropdown !== null}
            onToggle={closeDropdownHandler}
            drop="down"
          >
            <Dropdown.Toggle variant="dark" size="xl" style={{ width: '100%' }}>
              {showDropdown}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ width: '100%' }}>
              <Form>
                <Form.Group>
                  <Form.Label className='reflectionTitle'>{showDropdown} Reflection</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={reflections[showDropdown]} // Use the reflection for the current button
                    // onChange={reflectionChangeHandler}
                  />
                </Form.Group>
                {documents[showDropdown].map((document, index) => (
                  <Dropdown.Item
                    key={index}
                    href={'/portfolio_data/'+document+'.pdf'}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                     <div>
                      <span>{document}</span>
                      <span className='WordCount'>Word Count: {word_count[document]}</span>
                    </div>
                  </Dropdown.Item>
                ))}
              </Form>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </Container>
    </div>
  );
};

export default PortfolioPage;
