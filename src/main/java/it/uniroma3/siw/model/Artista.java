package it.uniroma3.siw.model;

import java.time.LocalDate;

import java.util.List;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


@Entity
public class Artista {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	@NotBlank
	private String nome;
	private LocalDate dataNascita;
	private String nazionalita;
	@Size(max = 255)
	private String imgUrl;
	@JsonIgnoreProperties("autore")
	@OneToMany(mappedBy="autore", cascade = CascadeType.REMOVE)
	private List<Album> albumIncisi;
	@JsonIgnoreProperties("autore")
	@OneToMany(mappedBy="autore", cascade = CascadeType.REMOVE)
	private List<Brano> braniIncisi;
	@JsonIgnoreProperties("featuring")
	@ManyToMany(mappedBy="featuring")
	private List<Brano> braniOspite;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	public LocalDate getDataNascita() {
		return dataNascita;
	}
	public void setDataNascita(LocalDate dataNascita) {
		this.dataNascita = dataNascita;
	}
	public String getNazionalita() {
		return nazionalita;
	}
	public void setNazionalita(String nazionalita) {
		this.nazionalita = nazionalita;
	}
	
	
	public String getImgUrl() {
		return imgUrl;
	}
	public void setImgUrl(String imgUrl) {
		this.imgUrl = imgUrl;
	}
	
	
	public List<Album> getAlbumIncisi() {
		return albumIncisi;
	}
	public void setAlbumIncisi(List<Album> albumIncisi) {
		this.albumIncisi = albumIncisi;
	}
	public List<Brano> getBraniIncisi() {
		return braniIncisi;
	}
	public void setBraniIncisi(List<Brano> braniIncisi) {
		this.braniIncisi = braniIncisi;
	}
	public List<Brano> getBraniOspite() {
		return braniOspite;
	}
	public void setBraniOspite(List<Brano> braniOspite) {
		this.braniOspite = braniOspite;
	}
	@Override
	public int hashCode() {
		return Objects.hash(nome);
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Artista other = (Artista) obj;
		return Objects.equals(nome, other.nome);
	}
	
	
	
}
