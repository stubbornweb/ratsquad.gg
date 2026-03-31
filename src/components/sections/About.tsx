"use client"

import { type JSX } from "react"
import { motion } from "framer-motion"
import { fadeUp, clipReveal, staggerSlow, slideInLeft } from "@/hooks/useAnimations"
import { pillars } from "@/data/about"

export default function About(): JSX.Element {
  return (
    <section className="section about" id="about">
      <div className="section-border-top" />
        <div className="section-container">
          <div className="about-grid">
            {/* Left — copy */}
            <motion.div
              className="about-content"
              variants={slideInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.div className="section-tag" variants={clipReveal}>
                <span className="tag-line" /> ХТО МИ
              </motion.div>
              <motion.h2 className="section-headline" variants={clipReveal}>
                ГРА, ЩО МАЄ СЕНС
              </motion.h2>
              <p>
                RATS — один із найстаріших EU кланів у Squad, заснований у 2021 році. У нас понад 20 активних гравців, і ми цінуємо якість, розвиток і командний дух.
              </p>
              <p>
                У нас кожна гра — шанс навчитися чомусь новому, покращити координацію та просто кайфанути від процесу. Плануємо все до дрібниць, граємо злагоджено, а після — розбираємо помилки, щоб наступного разу бути ще кращими.              </p>
              <p>
                Ми шукаємо адекватних і мотивованих гравців, які:
              </p>
              <ul>
                <li>вміють поєднувати свій лайфстайл із грою,</li>
                <li>хочуть вигравати і розвиватися,</li>
                <li>аналізують свої помилки та працюють над ними разом із командою.</li>
              </ul>
            </motion.div>

            {/* Right — pillars */}
            <motion.div
              className="about-pillars"
              variants={staggerSlow}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {pillars.map((p) => (
                <motion.div className="pillar" key={p.num} variants={fadeUp}>
                  <div className="ghost-number">{p.num}</div>
                  <h3 className="pillar-title">{p.title}</h3>
                  <p className="pillar-body">{p.body}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
          <motion.p
            className="about-closing"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            RATS — це спільнота людей, які люблять змагальний Squad, цінують координацію та командний склад, і з якими приємно проводити час.
          </motion.p>
        </div>
      </section>
  )
}
